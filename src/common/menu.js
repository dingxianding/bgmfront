import {isUrl} from '../utils/utils';

const menuData = [
  {
    name: '零部件研发信息管理',
    icon: 'form',
    path: 'teil',
    children: [
      {
        name: '基础信息',
        path: 'teil-list',
        authority: ['admin', 'master', 'user'],
      },
      {
        name: '研发信息',
        path: 'teil-schedule',
        authority: ['admin', 'master', 'user'],
      },
    ],
  },
  {
    name: 'Know-How信息管理',
    icon: 'setting',
    path: 'test',
    children: [
      {
        name: '试验信息',
        path: 'teil-test',
        authority: ['admin', 'master', 'user'],
      },
    ],
  },
  {
    name: '车型项目信息管理',
    icon: 'car',
    path: 'modell',
    children: [
      {
        name: '车型信息',
        path: 'modell-list',
        authority: ['admin','master'],
      },
      {
        name: '零部件查询',
        path: 'teil-search',
        authority: ['admin', 'master', 'user'],
      },
    ],
  },
  {
    name: '人员信息管理',
    icon: 'user',
    path: 'users',
    authority: ['admin'],
  },

];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let {path} = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
