import React, {FormEvent, FunctionComponent, useEffect, useState} from 'react';
import { Button, Select, Form, Input, message, Modal, Upload, Icon  } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
  PyramidUISendProjectBlockItemCreateAction
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {mainRequest} from "@/requests/main.request";
import {EBlockPackageAssemblyType} from "@/dicts/block-package.dict";
import {PyramidUIReceiveActionsUnion} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {ActionTypes} from "../../../../../core/config/event.config";

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
  params: {
    categories: [{name: string}],
    blockPackageAssemblyType: EBlockPackageAssemblyType,
    absolutePath: string;
  }
}

const Component: FunctionComponent<IProps> = props => {
  const [categories, setCategories] = useState<string[]>([]);

  const [imageUrl, setImageUrl] = useState('');
  const [imgLoading, setImgLoading] = useState(false);

  const {
    form,
    form: { getFieldDecorator },
  } = props;

  useEffect(() => {
    if (props.params.categories) {
      // 要保存起来，不知道怎么搞的，刷新的时候消失了
      const list = props.params.categories.map(v => v.name);
      setCategories(list);
    }

    const messageKey = pyramidUiService.getMessageFn((pyramidAction: PyramidUIReceiveActionsUnion) => {
      switch (pyramidAction.type) {
        case PyramidUIActionTypes.RECEIVE_CMD_EXECUTE_RESULT:
          if (pyramidAction.payload.pyramidUIActionType === ActionTypes.SEND_PROJECT_BLOCK_ITEM_CREATE) {
            message.destroy();
            if (!pyramidAction.payload.cmdExecuteResult) {
              message.error('创建区块失败');
              return;
            }
            props.closeModal(true);
          }
          break;
      }
    });

    return () => {
      message.destroy();
      pyramidUiService.clearMessageFn(messageKey);
    }
  }, []);

  // /**
  //  * 正则表达式
  //  */
  // const validateChineseName = (rule, value, callback) => {
  //   const regex = /^[\u4e00-\u9fa5]+$/;
  //   if (value && regex.test(value)) {
  //     callback();
  //   } else {
  //     callback(new Error('中文名必须输入汉字'));
  //   }
  // };
  //
  // const validateEnglishnName = (rule, value, callback) => {
  //   const regex = /^\w+$/;
  //   if (value && regex.test(value)) {
  //     callback();
  //   } else {
  //     callback(new Error('英文名必须输入字母或数字'));
  //   }
  // };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        delete fieldsValue['img'];
        const params = {...fieldsValue};
        params['blockType'] = getCliBlockType();
        params['blockImage'] = imageUrl;
        params['blockCategories'] = params['blockCategories'].toString();
        params['projectPath'] = props.params.absolutePath;

        pyramidUiService.sendMessageFn(new PyramidUISendProjectBlockItemCreateAction(params));
        message.loading('正在创建区块信息，请稍等...', 0);
      }
    });
  };

  const getCliBlockType = () => {
    let result = 'block';
    if (props.params.blockPackageAssemblyType) {
      if (props.params.blockPackageAssemblyType === EBlockPackageAssemblyType.BLOCK) {
        result = 'block';
      } else if (props.params.blockPackageAssemblyType === EBlockPackageAssemblyType.MODULE) {
        result = 'template';
      }
    }
    return result;
  };

  // 将base64转换成formData
  const toFromData = (base64String) => {
    let bytes = window.atob(base64String.split(',')[1]);
    let array = [];
    for(let i = 0; i < bytes.length; i++){
      array.push(bytes.charCodeAt(i));
    }
    let blob = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    // 生成FormData对象
    let fd = new FormData();
    fd.append('file', blob, Date.now() + '.jpg');
    return fd;
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setImgLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>{
          setImgLoading(false);
          mainRequest.uploadImg(toFromData(imageUrl)).then(res=>{
            setImageUrl(res.url);
          })
        }
      );
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      <Icon type={imgLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">上传照片</div>
    </div>
  );

  return (
    <Modal
      destroyOnClose={true}
      title="新建区块"
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Form onSubmit={handleSubmit}>
        <FormItem label='英文名称'>
          {getFieldDecorator(`blockName`, {
            rules: [
              { required: true, message: '必填' },
              // {
              //   validator: validateEnglishnName,
              // }
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='中文名称'>
          {getFieldDecorator(`blockNameZn`, {
            rules: [
              { required: true, message: '必填' },
              // {
              //   validator: validateChineseName,
              // }
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='分类'>
          {getFieldDecorator('blockCategories', {
            rules: [
              { required: true, message: '必填' },
            ]})(
            <Select
              placeholder="请选择"
              mode="multiple"
              allowClear={false}
            >
              {categories.map(data => {
                return (
                  <Select.Option value={data} key={data}>
                    {data}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </FormItem>

        <FormItem label='描述'>
          {getFieldDecorator(`blockDescription`, {
            rules: [
              { required: true, message: '必填' }
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label={'图片'} extra='只支持.jpg格式'>
          {getFieldDecorator(`img`)(
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          )}
        </FormItem>

        <FormItem >
          <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
            确定
          </Button>
          <Button htmlType="reset" onClick={() => props.closeModal()}>
            取消
          </Button>
        </FormItem>

      </Form>

    </Modal>
  );
};

export default Form.create<IProps>()(Component);

