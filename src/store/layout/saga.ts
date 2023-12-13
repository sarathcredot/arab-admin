// @flow
import { all, call, fork, takeEvery, put } from "redux-saga/effects";

import { LayoutTypes } from "./actionTypes";

import {
  changeSidebarType as changeSidebarTypeAction,
  changeTopbarTheme as changeTopbarThemeAction,
} from "./actions";

/**
 * Changes the body attribute
 */
function changeBodyAttribute(attribute: any, value: any) {
  if (document.body) document.body.setAttribute(attribute, value);
  return true;
}

/**
 * Toggle the class on body
 * @param {*} cssClass
 */
function manageBodyClass(cssClass: any, action = "toggle") {
  switch (action) {
    case "add":
      if (document.body) document.body.classList.add(cssClass);
      break;
    case "remove":
      if (document.body) document.body.classList.remove(cssClass);
      break;
    default:
      if (document.body) document.body.classList.toggle(cssClass);
      break;
  }

  return true;

}

/**
 * Changes the layout type
 * @param {*} param0
 */
function* changeLayout({ payload: layout }: any) {
  try {
    if (layout === "horizontal") {
      yield put(changeTopbarThemeAction("light"));
      document.body.removeAttribute("data-sidebar");
      yield call(changeBodyAttribute, "data-sidebar-size", "lg");
      if (document.body.getAttribute("data-bs-theme") === "dark") {
        yield put(changeTopbarThemeAction("dark"))
      }
    } else {
      yield put(changeTopbarThemeAction("light"));
      if (document.body.getAttribute("data-bs-theme") === "dark") {
        yield put(changeTopbarThemeAction("dark"))
      }
    }
    yield call(changeBodyAttribute, "data-layout", layout);
  } catch (error) { }
}

/**
 * Changes the layout width
 * @param {*} param0
 */
function* changeLayoutWidth({ payload: width }: any) {
  try {
    yield call(changeBodyAttribute, "data-layout-size", width);
  } catch (error) { }
}

/**
 * Changes the layout postion
 * @param {*} param0
 */
function* changeLayoutPosition({ payload: theme }: any) {
  try {
    yield call(changeBodyAttribute, "data-layout-scrollable", theme);
  } catch (error) { }
}

/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
function* changeLeftSidebarTheme({ payload: theme }: any) {
  try {
    yield call(changeBodyAttribute, "data-sidebar", theme);
  } catch (error) { }
}

/**
 * Changes the topbar theme
 * @param {*} param0
 */
function* changeTopbarTheme({ payload: theme }: any) {
  try {
    yield call(changeBodyAttribute, "data-topbar", theme);
  } catch (error) { }
}

/**
 * Changes the layout mode
 * @param {*} param0
 */
function* changelayoutMode({ payload: { layoutMode } }: any) {
  try {
    if (layoutMode === "light") {
      yield call(changeBodyAttribute, "data-bs-theme", layoutMode);
      yield put(changeTopbarThemeAction("light"));
    }
    else if (layoutMode === "dark") {
      yield call(changeBodyAttribute, "data-bs-theme", layoutMode);
      yield put(changeTopbarThemeAction("dark"));
    }
  } catch (error) { }
}

/**
 * Changes the left sidebar type
 * @param {*} param0
 */
function* changeLeftSidebarType({ payload: { sidebarType } }: any) {
  try {
    switch (sidebarType) {
      case "md":
        yield call(manageBodyClass, "sidebar-enable", "remove");
        yield call(changeBodyAttribute, "data-sidebar-size", "md");
        break;
      case "sm":
        yield call(manageBodyClass, "sidebar-enable", "remove");
        yield call(changeBodyAttribute, "data-sidebar-size", "sm");
        break;
      default:
        yield call(manageBodyClass, "sidebar-enable", "add");
        yield call(changeBodyAttribute, "data-sidebar-size", "lg");
        break;
    }
  } catch (error) { }
}

/**
 * Show the rightsidebar
 */
function* showRightSidebar() {
  try {
    yield call(manageBodyClass, "right-bar-enabled", "add");
  } catch (error) { }
}

/**
 * Watchers
 */
export function* watchChangeLayoutType() {
  yield takeEvery(LayoutTypes.CHANGE_LAYOUT, changeLayout);
}

export function* watchChangeLayoutWidth() {
  yield takeEvery(LayoutTypes.CHANGE_LAYOUT_WIDTH, changeLayoutWidth);
}

export function* watchChangeLeftSidebarTheme() {
  yield takeEvery(LayoutTypes.CHANGE_SIDEBAR_THEME, changeLeftSidebarTheme);
}

export function* watchChangeLayoutPosition() {
  yield takeEvery(LayoutTypes.CHANGE_LAYOUT_POSITION, changeLayoutPosition);
}

export function* watchChangeLeftSidebarType() {
  yield takeEvery(LayoutTypes.CHANGE_SIDEBAR_TYPE, changeLeftSidebarType);
}

export function* watchChangeTopbarTheme() {
  yield takeEvery(LayoutTypes.CHANGE_TOPBAR_THEME, changeTopbarTheme);
}

export function* watchChangelayoutMode() {
  yield takeEvery(LayoutTypes.CHANGE_LAYOUT_THEME, changelayoutMode);
}

export function* watchShowRightSidebar() {
  yield takeEvery(LayoutTypes.SHOW_RIGHT_SIDEBAR, showRightSidebar);
}

function* LayoutSaga() {
  yield all([
    fork(watchChangeLayoutType),
    fork(watchChangeLayoutWidth),
    fork(watchChangeLeftSidebarTheme),
    fork(watchChangeLeftSidebarType),
    fork(watchShowRightSidebar),
    fork(watchChangeTopbarTheme),
    fork(watchChangelayoutMode),
    fork(watchChangeLayoutPosition),
  ]);
}

export default LayoutSaga;
