import type { RouteRecordRaw } from 'vue-router';

import type { MenuRecordRaw } from '@vben-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';

type AccessToken = null | string;

interface AccessState {
  /**
   * 权限码
   */
  accessCodes: string[];
  /**
   * 可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[];
  /**
   * 可访问的路由列表
   */
  accessRoutes: RouteRecordRaw[];
  /**
   * 登录 accessToken
   */
  accessToken: AccessToken;
  /**
   * 是否已经检查过权限
   */
  isAccessChecked: boolean;
  /**
   * 是否锁屏状态
   */
  isLockScreen: boolean;
  /**
   * 锁屏密码
   */
  lockScreenPassword?: string;
  /**
   * 登录是否过期
   */
  loginExpired: boolean;
  /**
   * 登录 accessToken
   */
  refreshToken: AccessToken;
  /**
   * 登录租户编号
   */
  tenantId: null | number;
  /**
   * 访问租户编号
   */
  visitTenantId: null | number;
}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = defineStore('core-access', {
  actions: {
    /**
     * 通过路径获取菜单
     * @param path 菜单路径
     */
    getMenuByPath(path: string) {
      function findMenu(
        menus: MenuRecordRaw[],
        path: string,
      ): MenuRecordRaw | undefined {
        for (const menu of menus) {
          if (menu.path === path) {
            return menu;
          }
          if (menu.children) {
            const matched = findMenu(menu.children, path);
            if (matched) {
              return matched;
            }
          }
        }
      }

      return findMenu(this.accessMenus, path);
    },
    /**
     * 锁屏并设置密码
     * @param password 密码
     */
    lockScreen(password: string) {
      this.isLockScreen = true;
      this.lockScreenPassword = password;
    },
    /**
     * 设置权限码
     * @param codes 权限码数组
     */
    setAccessCodes(codes: string[]) {
      this.accessCodes = codes;
    },
    /**
     * 设置可访问菜单
     * @param menus 菜单数组
     */
    setAccessMenus(menus: MenuRecordRaw[]) {
      this.accessMenus = menus;
    },
    /**
     * 设置可访问路由
     * @param routes 路由数组
     */
    setAccessRoutes(routes: RouteRecordRaw[]) {
      this.accessRoutes = routes;
    },
    /**
     * 设置 accessToken
     * @param token accessToken
     */
    setAccessToken(token: AccessToken) {
      this.accessToken = token;
    },
    /**
     * 设置是否已经检查过权限
     * @param isAccessChecked 是否已经检查过权限
     */
    setIsAccessChecked(isAccessChecked: boolean) {
      this.isAccessChecked = isAccessChecked;
    },
    /**
     * 设置登录是否过期
     * @param loginExpired 登录是否过期
     */
    setLoginExpired(loginExpired: boolean) {
      this.loginExpired = loginExpired;
    },
    /**
     * 设置 refreshToken
     * @param token refreshToken
     */
    setRefreshToken(token: AccessToken) {
      this.refreshToken = token;
    },
    /**
     * 设置租户编号
     * @param tenantId 租户编号
     */
    setTenantId(tenantId: null | number) {
      this.tenantId = tenantId;
    },
    /**
     * 设置访问租户编号
     * @param visitTenantId 访问租户编号
     */
    setVisitTenantId(visitTenantId: number) {
      this.visitTenantId = visitTenantId;
    },
    /**
     * 解锁屏幕
     */
    unlockScreen() {
      this.isLockScreen = false;
      this.lockScreenPassword = undefined;
    },
  },
  persist: {
    // 持久化
    pick: [
      'accessToken',
      'refreshToken',
      'accessCodes',
      'tenantId',
      'visitTenantId',
      'isLockScreen',
      'lockScreenPassword',
    ],
  },
  state: (): AccessState => ({
    accessCodes: [], // 权限码
    accessMenus: [], // 可访问的菜单列表
    accessRoutes: [], // 可访问的路由列表
    accessToken: null, // 登录 accessToken
    isAccessChecked: false, // 是否已经检查过权限
    isLockScreen: false, // 是否锁屏状态
    lockScreenPassword: undefined, // 锁屏密码
    loginExpired: false, // 登录是否过期
    refreshToken: null, // 登录 refreshToken
    tenantId: null, // 登录租户编号
    visitTenantId: null, // 访问租户编号
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useAccessStore, hot));
}
