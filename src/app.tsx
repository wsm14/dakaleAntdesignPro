import iconEnum from '@/common/iconEnum';
import Footer from '@/components/Footer';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageContainer, PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser, getMenuList } from './services/ant-design-pro/api';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

// 动态菜单
const menuDataRender = (menu, keys = true) => {
  return menu.map((item) => {
    const {
      accessName: name,
      accessIcon: icon,
      accessUrl: path,
      childList: routes,
      buttons = null,
    } = item;
    const localItem = {
      name,
      icon: iconEnum[icon],
      path,
      buttons,
      routes: routes ? menuDataRender(routes, false) : undefined,
    };
    return localItem;
  });
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchMenu?: any;
  menuList?: any;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  //获取paylout列表
  const fetchMenu = async () => {
    try {
      const result = await getMenuList();
      return menuDataRender(result.content.permissionTree);
    } catch (error) {
      history.push(loginPath);
    }
  };

  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    // const currentUser = await fetchUserInfo();
    const menuList = await fetchMenu();
    return {
      // fetchUserInfo,
      // currentUser,
      menuList,
      fetchMenu,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    fetchMenu,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    menuDataRender: () => initialState?.menuList,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    // links: isDev
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //       <Link to="/~docs" key="docs">
    //         <BookOutlined />
    //         <span>业务组件文档</span>
    //       </Link>,
    //     ]
    //   : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {props.location?.pathname === '/user/login' ? (
            children
          ) : (
            <PageContainer title={false}>{children}</PageContainer>
          )}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
