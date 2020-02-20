import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Card, Checkbox, Form, Icon, Input} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from './index.less';
import Add from '@/pages/Computer/Projects/Add/Index';
import {pyramidUiService} from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
  PyramidUISendProjectListAction,
  PyramidUISendProjectRemoveAction,
  PyramidUISendProjectStartAction
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {
  PyramidUIReceiveActionsUnion,
  PyramidUIReceiveProjectChoosePathAction,
  PyramidUIReceiveProjectListAction,
} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {EPlatform} from "@/enums/platform.enum";

const FormItem = Form.Item;
const iconApp = require("../../../assets/icon_app.png");

interface IProps extends FormComponentProps {
  location: {pathname: string}
}

const Component: FunctionComponent<IProps> = props => {
  const [platform, setPlatform] = useState<EPlatform>(EPlatform.PC);

  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [modalParams, setModalParams] = useState<any>(null);

  const [cards, setCards] = useState<any[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [editBoxShow, setEditBoxShow] = useState(false);

  useEffect(() => {
    getProjectsData();
  }, [platform]);

  useEffect(() => {
    const pathname = props.location.pathname;
    if (pathname.indexOf('/pc') !== -1) {
      setPlatform(EPlatform.PC);
    } else if (pathname.indexOf('/mobile') !== -1) {
      setPlatform(EPlatform.MOBILE);
    }

    // 统一监控 - 取得信息的处理
    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveActionsUnion) => {
      switch (pyramidAction.type) {
        // 返回项目列表
        case PyramidUIActionTypes.RECEIVE_PROJECT_LIST:
          receive_project_list(pyramidAction);
          break;
        // 返回删除处理
        case PyramidUIActionTypes.RECEIVE_PROJECT_CHOOSE_PATH:
          receive_project_choose_path(pyramidAction);
          break;
        case PyramidUIActionTypes.RECEIVE_CMD_EXECUTE_RESULT:
          if (pyramidAction.payload.pyramidUIActionType === PyramidUIActionTypes.SEND_PROJECT_CREATE) {
            if (pyramidAction.payload.cmdExecuteResult) {
              getProjectsData();
            }
          }
          break;
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  const { form, form: { getFieldDecorator } } = props;

  const receive_project_list = (action: PyramidUIReceiveActionsUnion) =>{
    const newAction = action as PyramidUIReceiveProjectListAction;
    const newData = newAction.payload.projects.map((item) => {
      item.checked = false;
      return item;
    });
    setCards(newData);
  };

  const receive_project_choose_path = (action: PyramidUIReceiveActionsUnion) => {
    const newAction = action as PyramidUIReceiveProjectChoosePathAction;
    form.setFieldsValue({
      path: newAction.payload.files
    });
  };

  const startProject = (projectInfo) => {
    pyramidUiService.sendMessageFn(new PyramidUISendProjectStartAction({projectInfo}));
  };

  /**
   * 请求项目列表
   */
  const getProjectsData = () => {
    switch (platform) {
      case EPlatform.PC:
        pyramidUiService.sendMessageFn(new PyramidUISendProjectListAction({platform: EPlatform.PC}));
        break;
      case EPlatform.MOBILE:
        pyramidUiService.sendMessageFn(new PyramidUISendProjectListAction({platform: EPlatform.MOBILE}));
        break;
    }
  };

  const onChange = (e, index) => {
    const newCards = [...cards];
    newCards[index].checked = e.target.checked;
    setCards(newCards);
  };

  const onCheckAllChange = (e) => {
    setAllChecked(e.target.checked);
    const newCards = cards.map((item) => {
      item.checked = e.target.checked;
      return item
    });
    setCards(newCards);
  };

  const editFun = () => {
    setEditBoxShow(true);
  };

  const editCompFun = () => {
    setEditBoxShow(false);
  };

  const deleteFun = () => {
    let  deleteArr: string[] = [];
    cards.map((card)=>{
      if(card.checked && card.name){
        deleteArr.push(card.name)
      }
    });

    pyramidUiService.sendMessageFn(new PyramidUISendProjectRemoveAction({projectNames: deleteArr}));
    getProjectsData();
  };

  return (
    <div className={styles.main}>
      <Card bordered={false}>
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
                  <Button type="primary" onClick={deleteFun}>
                    删除
                  </Button>
                  <Button onClick={editCompFun}>
                    完成
                  </Button>
                  <Checkbox
                    indeterminate={false}
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
          {/* 新增应用 */}
          <div className={styles.flexBox} onClick={() => {
            setModalParams({platform});
            setAddModalVisible(true);
          }}>
            <div className={styles.addBox}>
              <Icon type="plus" className={styles.add} />
              <p className={styles.name}>新增应用</p>
            </div>
          </div>

          {/* 已经创建的应用 */}
          {
            cards.map((card, index) => {
              return (
                <Card key={card._id} className={styles.flexBox} onClick={() => startProject(card)}>
                  <img src={iconApp} alt="" className={styles.iconApp} />
                  <p className={styles.name}>{card.name}</p>
                  <p className={styles.path}>{card.path}</p>
                  <p>V1.0.0</p>
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

      {/* 添加项目 */}
      {addModalVisible ? (
        <Add
          modalVisible={addModalVisible}
          params={modalParams}
          closeModal={success => {
            setAddModalVisible(false);
            setModalParams(null);
            if (success) {
            }
          }}
        />
      ) : null}
    </div>

  )
};

export default Form.create<IProps>({})(Component);
