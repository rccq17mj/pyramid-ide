import {FormEvent, FunctionComponent, useEffect, useState} from "react";
import {Button, Col, Form, Input, Modal, Row, Select, TreeSelect} from "antd";
import React from "react";
import {FormComponentProps} from "antd/lib/form";
import {REGEX_CONFIG} from "@/core/configs/regex.config";
import {pyramidUiService} from "@/core/pyramid-ui/service/pyramid-ui.service";
import {
  PyramidUIActionsUnion, PyramidUIActionTypes,
  PyramidUISendProjectModuleCreateAction,
  PyramidUISendProjectModuleGetRouteTreeAction
} from "@/core/pyramid-ui/action/pyramid-ui.action";
import {IBlockCard} from "@/interfaces/block/block.interface";
import {treeService} from "@/core/services/tree.service";
import {TreeNode} from "antd/lib/tree-select";

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  params?: IBlockCard;
}

const Component: FunctionComponent<IProps> = props => {
  const [routerTree, setRouteTree] = useState<TreeNode[]>([
    // 缺省值
    {
      key: '0',
      title: '/',
      value: ''
    },
    // {
    //   key: '1',
    //   title: "/user",
    //   value: "user",
    //   children: [
    //     {
    //       key: "1-0",
    //       title: "/user/login",
    //       value: "user/login",
    //     }
    //   ]
    // },
    // {
    //   key: "2",
    //   title: "/",
    //   value: "",
    //   children: [
    //     {
    //       key: "2-0",
    //       title: "/",
    //       value: "",
    //       children: [
    //         {
    //           key: "2-1-1",
    //           title: "/welcome",
    //           value: "welcome"
    //         },
    //         {
    //           key: "2-1-2",
    //           title: "/admin",
    //           value: "admin"
    //         },
    //         {
    //           key: "2-1-3",
    //           title: "/empty",
    //           value: "empty"
    //         }
    //       ]
    //     }
    //   ],
    // }
  ]);

  useEffect(() => {
    if (props.params) {
      form.setFieldsValue({
        menuNameZh: props.params.name,
        menuNameEn: props.params.key,
        routePathSuffix: props.params.key,
        filePath: '/' + props.params.key,
        remark: props.params.description
      });
    }

    // 发送消息获取路由信息
    pyramidUiService.sendMessageFn(new PyramidUISendProjectModuleGetRouteTreeAction());
    // 获取路由消息
    const messageKey = pyramidUiService.getMessageFn((action: PyramidUIActionsUnion) => {
      if (action.type === PyramidUIActionTypes.RECEIVE_PROJECT_MODULE_GET_ROUTE_TREE) {
        const getRouterTree = JSON.parse(JSON.stringify(action.payload.routerTree));
        if (getRouterTree) {
          getRouterTree.unshift({path: '/'});

          // 这里为了组装成树数据
          let i = 0;
          treeService.visitTree(getRouterTree, (item, parent, deep) => {
            item.key = i.toString();
            item.title = item.path;
            // 去掉第一个斜杠
            item.value = item.path.substr(1);
            i += 1;
          });

          setRouteTree(getRouterTree);
        }
      }
    });

    return () => {
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  const packages = [
    {
      name: 'yarn'
    }
  ];

  const {form, form: { getFieldDecorator }} = props;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      let routePath = '';
      if (fieldsValue.routePathPrefix === '') {
        routePath = '/' + fieldsValue.routePathSuffix;
      } else {
        routePath = '/' + fieldsValue.routePathPrefix + '/' + fieldsValue.routePathSuffix;
      }
      const params = {...fieldsValue,
        gitUrl: props.params.gitUrl,
        routePath: routePath,
      };
      pyramidUiService.sendMessageFn(new PyramidUISendProjectModuleCreateAction(params));
      props.closeModal(true);
    });
  };

  return (
    <Modal
      destroyOnClose={true}
      title={'新增路由'}
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}
    >
      <Form layout="vertical" onSubmit={handleSubmit}>
        <FormItem label="菜单名称">
          <Row gutter={16}>
            <Col span={12}>
              {getFieldDecorator(`menuNameZh`, {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                  {
                    validator: REGEX_CONFIG.EMPTY_CHAR.FUNC,
                    message: REGEX_CONFIG.EMPTY_CHAR.DESC,
                  },
                ],
              })(<Input placeholder="中文名称" />)}
            </Col>
            <Col span={12}>
              {getFieldDecorator(`menuNameEn`, {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                  {
                    validator: REGEX_CONFIG.EMPTY_CHAR.FUNC,
                    message: REGEX_CONFIG.EMPTY_CHAR.DESC,
                  },
                ],
              })(<Input placeholder="英文名称" />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="路由路径">
          <Row gutter={16}>
            <Col span={12}>
              {getFieldDecorator(`routePathPrefix`, {
                initialValue: '',
                rules: [
                ],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={routerTree}
                  placeholder="请选择"
                />
              )}
            </Col>
            <Col span={12}>
              {getFieldDecorator(`routePathSuffix`, {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                  {
                    validator: REGEX_CONFIG.EMPTY_CHAR.FUNC,
                    message: REGEX_CONFIG.EMPTY_CHAR.DESC,
                  },
                ],
              })(
                <Input placeholder={'请输入'} />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="文件路径">
          <Row gutter={16}>
            <Col span={24}>
              {getFieldDecorator(`filePath`, {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                  {
                    validator: REGEX_CONFIG.EMPTY_CHAR.FUNC,
                    message: REGEX_CONFIG.EMPTY_CHAR.DESC,
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="包管理器">
          <Row gutter={16}>
            <Col span={24}>
              {getFieldDecorator(`package`, {
                initialValue: packages[0].name,
                rules: [
                  {
                    required: true,
                    message: '必填',
                  }
                ],
              })(
                <Select placeholder="请选择">
                  {packages.map(data => {
                    return (
                      <Select.Option value={data.name} key={data.name}>
                        {data.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="备注">
          <Row gutter={16}>
            <Col span={24}>
              {getFieldDecorator(`remark`, {
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                  {
                    validator: REGEX_CONFIG.EMPTY_CHAR.FUNC,
                    message: REGEX_CONFIG.EMPTY_CHAR.DESC,
                  },
                ],
              })(
                <Input placeholder="用于页面统计" />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <div style={{textAlign: 'center'}}>
            <Button type={"primary"} style={{marginRight: 20}} htmlType="submit">创建</Button>
            <Button onClick={() => props.closeModal()}>取消</Button>
          </div>

        </FormItem>
      </Form>
    </Modal>
  )
};

export default Form.create<IProps>()(Component);
