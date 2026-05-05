import { useEffect, useMemo, useRef } from 'react';
import { routeForFile } from '../generated/pages.js';
import Sidebar from './Sidebar.jsx';

const htmlFilePattern = /([\w\d]+[a-z]?-[^'"()<>]+?\.html|index\.html)/g;

function extractHtmlParts(documentHtml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(documentHtml, 'text/html');
  const styles = Array.from(doc.querySelectorAll('style')).map((node) => node.textContent || '');
  const scripts = Array.from(doc.querySelectorAll('script')).map((node) => node.textContent || '');
  doc.querySelectorAll('script, link[rel="stylesheet"]').forEach((node) => node.remove());
  const title = doc.querySelector('title')?.textContent || '大魔王智能素材管理系统';

  // 检测并移除原始 HTML 中的 <aside class="sidebar">,改由共享的 React Sidebar 组件渲染。
  // 同时把 <div class="app-layout"> 拆开,避免重复嵌套外层布局。
  const sidebarEl = doc.querySelector('aside.sidebar');
  const layoutEl = doc.querySelector('.app-layout');
  const hasSidebar = !!sidebarEl;

  if (sidebarEl) {
    sidebarEl.remove();
  }

  let body;
  if (hasSidebar && layoutEl) {
    // app-layout 由 React 端提供,这里只输出去除侧边栏后的内层内容(通常是 <main class="main-content">)
    body = rewritePrototypeLinks(layoutEl.innerHTML);
  } else {
    body = rewritePrototypeLinks(doc.body.innerHTML);
  }

  return {
    title,
    styles,
    scripts,
    hasSidebar,
    body,
  };
}

function rewritePrototypeLinks(html) {
  return html.replace(htmlFilePattern, (file) => routeForFile(file) || `/prototype/${file}`);
}

function exposeScriptFunctions(script) {
  const names = new Set();
  const functionPattern = /function\s+([A-Za-z_$][\w$]*)\s*\(/g;
  let match = functionPattern.exec(script);
  while (match) {
    names.add(match[1]);
    match = functionPattern.exec(script);
  }

  if (!names.size) {
    return script;
  }

  const expose = Array.from(names)
    .map((name) => `if (typeof ${name} === 'function') window.${name} = ${name};`)
    .join('\n');

  return `${script}\n${expose}`;
}

export default function PrototypePage({ page }) {
  const containerRef = useRef(null);
  const parts = useMemo(() => extractHtmlParts(page.html), [page.html]);

  useEffect(() => {
    document.title = parts.title;

    const styleNodes = parts.styles.map((cssText) => {
      const style = document.createElement('style');
      style.dataset.prototypePage = page.file;
      style.textContent = cssText;
      document.head.appendChild(style);
      return style;
    });

    const onMessage = (event) => {
      if (event.data === 'closeModal' && typeof window.closeModal === 'function') {
        window.closeModal();
      }
    };
    window.addEventListener('message', onMessage);

    const timers = new Set();
    const originalSetInterval = window.setInterval;
    window.setInterval = (handler, timeout, ...args) => {
      const id = originalSetInterval(handler, timeout, ...args);
      timers.add(id);
      return id;
    };

    parts.scripts.forEach((script) => {
      try {
        new Function(exposeScriptFunctions(script))();
      } catch (error) {
        console.error(`页面脚本执行失败: ${page.file}`, error);
      }
    });

    window.setInterval = originalSetInterval;

    return () => {
      styleNodes.forEach((node) => node.remove());
      window.removeEventListener('message', onMessage);
      timers.forEach((id) => clearInterval(id));
      window.setInterval = originalSetInterval;
    };
  }, [page.file, parts]);

  if (!page?.html) {
    return <div className="route-missing">页面不存在</div>;
  }

  // 带侧边栏的页面:由 React 渲染共享 Sidebar,内容区使用原 HTML 注入
  if (parts.hasSidebar) {
    return (
      <div className="app-layout">
        <Sidebar activeFile={page.file} />
        <div
          ref={containerRef}
          className="prototype-main-wrapper"
          style={{ display: 'contents' }}
          dangerouslySetInnerHTML={{ __html: parts.body }}
        />
      </div>
    );
  }

  // 无侧边栏的页面(如门户、弹窗)按原样输出
  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: parts.body }} />;
}
