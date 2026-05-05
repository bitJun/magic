const pageModules = import.meta.glob('../prototype/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const fileHtml = Object.fromEntries(
  Object.entries(pageModules).map(([key, value]) => [key.split('/').pop(), value]),
);

export const pages = [
  { path: '/', file: 'index.html', title: '原型导航' },
  { path: '/search', file: '01-智能搜索.html', title: '智能搜索' },
  { path: '/materials', file: '02-素材库管理.html', title: '素材库管理' },
  { path: '/projects', file: '03-项目管理.html', title: '项目管理' },
  { path: '/faces', file: '04-人脸识别库.html', title: '人脸识别库' },
  { path: '/analytics', file: '05-数据分析.html', title: '数据分析' },
  { path: '/login', file: '06-登录.html', title: '登录' },
  { path: '/upload', file: '07-素材上传弹窗.html', title: '素材上传弹窗' },
  { path: '/shot-detail', file: '08-分镜详情页.html', title: '分镜详情页' },
  { path: '/material-shots', file: '09-素材分镜列表页.html', title: '素材分镜列表页' },
  { path: '/new-project', file: '10-新建项目弹窗.html', title: '新建项目弹窗' },
  { path: '/project-detail', file: '11-项目详情页.html', title: '项目详情页' },
  { path: '/video-preview', file: '12-视频预览弹窗.html', title: '视频预览弹窗' },
  { path: '/project-selector', file: '13-项目选择器弹窗.html', title: '项目选择器弹窗' },
  { path: '/confirm-dialogs', file: '14-确认弹窗集合.html', title: '确认弹窗集合' },
  { path: '/settings', file: '15-设置页面.html', title: '设置页面' },
  { path: '/profile', file: '16-用户个人信息.html', title: '用户个人信息' },
  { path: '/person-shots', file: '17-人物分镜列表页.html', title: '人物分镜列表页' },
  { path: '/person-add', file: '18a-添加人物弹窗.html', title: '添加人物弹窗' },
  { path: '/person-edit', file: '18b-编辑人物信息弹窗.html', title: '编辑人物信息弹窗' },
  { path: '/face-label', file: '18c-人脸标注弹窗.html', title: '人脸标注弹窗' },
  { path: '/face-batch-label', file: '18d-批量标注弹窗.html', title: '批量标注弹窗' },
  { path: '/person-merge', file: '18e-合并人物弹窗.html', title: '合并人物弹窗' },
  { path: '/notifications', file: '19-通知中心.html', title: '通知中心' },
  { path: '/trash', file: '20-回收站.html', title: '回收站' },
].map((page) => ({
  ...page,
  html: fileHtml[page.file],
}));

export const pageByFile = Object.fromEntries(pages.map((page) => [page.file, page]));
export const pageByPath = Object.fromEntries(pages.map((page) => [page.path, page]));

export function getPageByPath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  return pageByPath[cleanPath];
}

export function routeForFile(file) {
  return pageByFile[file]?.path;
}
