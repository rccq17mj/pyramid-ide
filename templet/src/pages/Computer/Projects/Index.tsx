import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Card, Form, Input, Checkbox, Icon } from "antd";
import { FormComponentProps } from "antd/lib/form";
import styles from './index.less';
import Add from '@/pages/Computer/Projects/Add/Index';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
  PyramidUISendProjectRemoveAction,
  PyramidUISendProjectListAction,
  PyramidUISendProjectStartAction
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {
  PyramidUIReceiveActionsUnion, PyramidUIReceiveProjectChoosePathAction,
  PyramidUIReceiveProjectListAction
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";

const FormItem = Form.Item;
const iconApp = require("../../../assets/icon_app.png");
const defaultCheckedList = [];


interface IProps extends FormComponentProps {
}

const Component: FunctionComponent<IProps> = props => {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<any[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [editBoxShow, setEditBoxShow] = useState(false);



  useEffect(() => {
    getProjectsData();

    // 统一监控 - 取得信息的处理
    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveActionsUnion) => {
      switch (pyramidAction.type) {
        // 返回项目列表
        case PyramidUIActionTypes.RECEIVE_PROJECT_LIST:
          const action1: PyramidUIReceiveProjectListAction = pyramidAction as PyramidUIReceiveProjectListAction;
          receive_project_list(action1.payload);
          break;
        // 返回删除处理
        case PyramidUIActionTypes.RECEIVE_PROJECT_CHOOSE_PATH:
          const action2: PyramidUIReceiveProjectChoosePathAction = pyramidAction as PyramidUIReceiveProjectChoosePathAction;
          receive_project_choose_path(action2.payload);
          break;
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  const { form, form: { getFieldDecorator } } = props;

  const receive_project_list = (payload) =>{
    const newData = payload.data.map((item) => {
      item.checked = false;
      return item;
    })
   setCards(newData);
  }

  const receive_project_choose_path = (payload) =>{
        form.setFieldsValue({
          path: payload.files
        })
  }

  const startProject = (projectInfo) => {
    const params = { project: true, msg: 'startProject', projectInfo };
    pyramidUiService.sendMessageFn(new PyramidUISendProjectStartAction(params));
  };

  /**
   * 请求项目列表
   */
  const getProjectsData = () => {
    if (window.location.pathname === '/pc') {
      pyramidUiService.sendMessageFn(new PyramidUISendProjectListAction({platform: 'pc'}));
    } else {
      pyramidUiService.sendMessageFn(new PyramidUISendProjectListAction({platform: 'mobile'}));
    }
  }

  const [state, setState] = useState({
    checkedList: defaultCheckedList,
    indeterminate: false,
    checkAll: false,
  })

  const onChange = (e, index) => {
    let newCards = [...cards];
    newCards[index].checked = e.target.checked;
    setCards(newCards);
  };

  const onCheckAllChange = (e) => {
    setAllChecked(e.target.checked);
    let newCards = cards.map((item) => {
      item.checked = e.target.checked;
      return item
    })
    setCards(newCards);
  };

  const editFun = () => {
    setEditBoxShow(true);
  }

  const editCompFun = () => {
    setEditBoxShow(false);
  }

  const delateFun = () => {
    let  delateArr = []
    cards.map((card)=>{
      if(card.checked && card.name){
        delateArr.push(card.name)
      }
    })

    pyramidUiService.sendMessageFn(new PyramidUISendProjectRemoveAction(delateArr));
    getProjectsData();
  }
  return (
    <div className={styles.main}>
      <Card bordered={false} className={styles.cards}>
        {/* 表单 */}
        <Form
          layout="inline"
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <FormItem>
            {getFieldDecorator('search')(<Input placeholder="请输入应用名称" className={styles.inputAppName} />)}
          </FormItem>
          <FormItem className={styles.rightBox}>
            {
              editBoxShow ?
                <div>
                  <Button type="primary" onClick={delateFun}>
                    删除
                </Button>
                  <Button onClick={editCompFun}>
                    完成
                </Button>
                  <Checkbox
                    indeterminate={state.indeterminate}
                    onChange={onCheckAllChange}
                    checked={allChecked}
                    className={styles.checkAll}
                  >
                    全选
                </Checkbox>
                </div> :
                <div>
                  <Button type="primary" htmlType="submit">
                    搜索
                </Button>
                  <Button onClick={editFun}>
                    管理
                </Button>
                </div>
            }

          </FormItem>
        </Form>
        <div className={styles.cardBody}>
          <div className={styles.flexBox}>
            <div className={styles.addBox}>
              <Icon type="plus" onClick={() => setAddModalVisible(true)} className={styles.add} />
              <p className={styles.name}>新增应用</p>
            </div>
          </div>

          {
            cards.map((card, index) => {
              return (
                <Card key={card._id} className={styles.flexBox} hoverable onClick={() => startProject(card)}>
                  <img src={iconApp} alt="" className={styles.iconApp} />
                  <p className={styles.name}>{card.name}</p>
                  <p>{card.path}</p>
                  <p>V1.0.1</p>
                  {editBoxShow ?
                    <Checkbox
                      onChange={(e) => { onChange(e, index) }}
                      className={styles.checkItem}
                      onClick={(e) => { e.stopPropagation() }}
                      checked={card.checked}
                    /> : null
                  }
                </Card>
              )
            })
          }

        </div>

      </Card>
      {addModalVisible ? (
        <Add
          modalVisible={addModalVisible}
          closeModal={success => {
            setAddModalVisible(false);
            if (success) {
            }
          }}
        />
      ) : null}
    </div>

  )
};

export default Form.create<IProps>({})(Component);
