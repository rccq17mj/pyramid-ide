/**
 * ACL配置
 */
export const ACL_CONFIG = {
  // 结算中心
  SETTLEMENT_CENTER: {
    // 入驻商家
    BUSINESS: {
      // 确认
      CONFIRM: 'entryBusStatementConfirm',
      // 审核
      AUDIT: 'entryBusStatementAudit'
    },
    // 爆款商家
    HOT: {
      // 确认
      CONFIRM: 'hotSupplierStatementConfirm',
      // 审核
      AUDIT: 'hotSupplierStatementAudit'
    }
  },
};
