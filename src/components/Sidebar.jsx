import { routeForFile } from '../generated/pages.js';

// 侧边栏导航配置 —— 修改菜单项请编辑此数组
const NAV_SECTIONS = [
  {
    title: '核心功能',
    items: [
      { icon: '🔍', label: '智能搜索', file: '01-智能搜索.html' },
      { icon: '📦', label: '素材库', file: '02-素材库管理.html' },
      { icon: '📁', label: '项目管理', file: '03-项目管理.html' },
    ],
  },
  {
    title: '智能工具',
    items: [
      { icon: '👤', label: '人脸识别库', file: '04-人脸识别库.html' },
      { icon: '📊', label: '数据分析', file: '05-数据分析.html' },
    ],
  },
  {
    title: '系统',
    items: [
      { icon: '🗑️', label: '回收站', file: '20-回收站.html' },
      { icon: '⚙️', label: '设置', file: '15-设置页面.html' },
    ],
  },
];

const USER_INFO = {
  name: '张三',
  role: '管理员',
  avatar: '张',
  file: '16-用户个人信息.html',
};

const BRAND = {
  icon: '✦',
  name: '大魔王',
  subtitle: '智能素材管理系统',
};

function hrefFor(file) {
  return routeForFile(file) || `/prototype/${file}`;
}

export default function Sidebar({ activeFile }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">{BRAND.icon}</div>
        <div className="logo-text">
          <span className="brand">{BRAND.name}</span>
          <span className="subtitle">{BRAND.subtitle}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div className="nav-section" key={section.title}>
            <div className="nav-section-title">{section.title}</div>
            {section.items.map((item) => {
              const isActive = item.file === activeFile;
              return (
                <a
                  key={item.file}
                  href={hrefFor(item.file)}
                  className={`nav-item${isActive ? ' active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span> {item.label}
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      <a href={hrefFor(USER_INFO.file)} className="sidebar-user">
        <div className="user-avatar">{USER_INFO.avatar}</div>
        <div className="user-info">
          <span className="user-name">{USER_INFO.name}</span>
          <span className="user-role">{USER_INFO.role}</span>
        </div>
      </a>
    </aside>
  );
}
