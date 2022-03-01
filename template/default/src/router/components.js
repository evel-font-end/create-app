
/**
 * 动态路由部件映射
 */
const MainView = () =>
    import('components/mainView');
const BidderMainView = () =>
    import('components/bidderMainView');

export default {
  'index': MainView,
  'indexPage': () => import('view/testpage/index'),
  'people_deal_management': MainView,
  'people_deal_notic_list': MainView,
  'people_deal_management_static': BidderMainView,
  'people_deal_notic_list_static': BidderMainView,
  'bidding_price_list': () =>
  import('view/peopleDealManagement/biddingPriceList/index'),
  'people_deal_offer_log': () =>
  import('view/peopleDealManagement/peopleDealOfferLog/index'),
  'edit': () =>
  import('view/peopleDealManagement/peopleDealOfferLog/Edit'),
  'tarage_apply': () =>
  import('view/peopleDealNoticList/tarageApply/index'),
  'updatePassword': () =>
  import('components/updatePassword/updatePassword'),
  'land_management': MainView,
  'goods_list': () =>
  import('view/landManagement/landTrade/LandTradeList'),
  'tarage_list': () =>
  import('view/landManagement/tarageList/index'),
  'notice_list': () =>
  import('view/landManagement/noticeList/index'),
  'mine_management': MainView,
  'mine_list': () =>
  import('view/mineManagement/TradeList/index'),
  'mine_target_list': () =>
  import('view/mineManagement/mineTargetList/index'),
  'mine_notice_list': () =>
  import('view/mineManagement/mineNoticeList/index'),
  'plow_management': MainView,
  'low_index_list': () =>
  import('view/plowMmanagement/lowIndexList/index'),
  'low_noticelist': () =>
  import('view/plowMmanagement/lowNoticelist/index'),
  'deal_management': MainView,
  'deal_land_manage': () =>
  import('view/dealManagement/dealLandManage/index'),
  'break_deal_list': () =>
  import('view/dealManagement/dealLandManage/breakdealList/index'),
  'high_price_mange_list': () =>
  import('view/dealManagement/dealLandManage/highPriceMangeList/index'),
  'low_price_mange_list': () =>
  import('view/dealManagement/dealLandManage/lowPriceMangeList/index'),
  'update_deal_list': () =>
  import('view/dealManagement/dealLandManage/updatedealLlist/index'),
  'afterdeal_list': () =>
  import('view/dealManagement/dealLandManage/afterdealList/index'),
  'mine_deal_management': () =>
  import('view/dealManagement/mineDealManagement/index'),
  'mine_break_deal_list': () =>
  import('view/dealManagement/mineDealManagement/mineBreakdealList/index'),
  'mie_high_price_mange_list': () =>
  import('view/dealManagement/mineDealManagement/mieHighPriceMangeList/index'),
  'mine_low_price_mange_list': () => import('view/dealManagement/mineDealManagement/mineLowPriceMangeList/index'),
  'mine_afterdeal_list': () => import('view/dealManagement/mineDealManagement/mineAfterdealList/index'),
  'mine_control_list': () =>
  import('view/dealManagement/mineDealManagement/mineControlList/index'),
  'plow_deal_management': () =>
  import('view/dealManagement/plowDealManagement/index'),
  'plow_qualification_examine': () =>
  import('view/dealManagement/plowDealManagement/plowQualificationExamine/index'),
  'plow_updatedeal_list': () =>
  import('view/dealManagement/plowDealManagement/plowUpdatedealList/index'),
  'plow_breakdeal_list': () =>
  import('view/dealManagement/plowDealManagement/plowBreakdealList/index'),
  'plow_random_management': () =>
  import('view/dealManagement/plowDealManagement/plowRandomManagement/index'),
  'plow_low_price_mange_list': () =>
  import('view/dealManagement/plowDealManagement/plowLowPriceMangeList/index'),
  'deal_examine': MainView,
  'audit_Information': () =>
  import('view/dealExamine/auditInformation/index'),
  'basic_information_management': MainView,
  'role_management': () =>
  import('view/baseInfoManage/roleManagement/index'),
  'user_management': () =>
  import('@/view/baseInfoManage/userManagement/Users'),
  'resources_management': () =>
  import('@/view/baseInfoManage/resourcesManagement/index'),
  'dictionaries-management': () =>
  import('@/view/baseInfoManage/dictionariesManagement/index'),
  'atta_templet': () =>
  import('@/view/baseInfoManage/attaTemplet/index'),
  'approve_config': () =>
  import('@/view/baseInfoManage/approveConfig/index')
};
