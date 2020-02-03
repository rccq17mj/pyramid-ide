import { Modal } from 'antd';
import * as React from 'react';

const confirm = Modal.confirm;

class ModalService {
  /**
   * 创建确认模态框
   * @param modalContent
   * @param cb
   * @param modalTitle
   */
  confirm(modalContent: React.ReactNode, cb: () => void, modalTitle?: string) {
    confirm({
      title: modalTitle || '温馨提示',
      content: modalContent,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        cb();
      },
    });
  }
}

export const modalService = new ModalService();
