import React, {FormEvent, FunctionComponent, useEffect, useState} from 'react';
import { Button, Select, Form, Input, message, Modal, Upload, Icon  } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { pyramidUiService } from '@/core/pyramid-ui/service/pyramid-ui.service';
import {
  PyramidUISendProjectChoosePathAction,
  PyramidUISendProjectBlockCreateAction
} from "@/core/pyramid-ui/action/pyramid-ui-send.action";
import {PyramidUIActionTypes} from "@/core/pyramid-ui/action";
import {PyramidUIReceiveProjectChoosePathAction} from "@/core/pyramid-ui/action/pyramid-ui-receive.action";
import {mainRequest} from "@/requests/main.request";
import {BlockPackageEndType} from "@/dicts/block-package.dict";

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  modalVisible: boolean;
  closeModal: (data?: any) => void;
}

const Component: FunctionComponent<IProps> = props => {
  const [imageUrl, setImageUrl] = useState('');
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    pyramidUiService.getMessageFn((action: PyramidUIReceiveProjectChoosePathAction) => {
      switch (action.type) {
        case PyramidUIActionTypes.RECEIVE_PROJECT_CHOOSE_PATH:
          form.setFieldsValue({
            filePath: action.payload.files
          });
          break;
        default:
          break;
      }
    });
  }, []);

  const {
    form,
    form: { getFieldDecorator },
  } = props;

  const templetOptions = BlockPackageEndType;
  const pkgmtOptions = [
    { label: 'yarn', value: 'yarn' }
  ];

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
        const params = fieldsValue;
        params['remarkImg'] = imageUrl;
        pyramidUiService.sendMessageFn(new PyramidUISendProjectBlockCreateAction({blockPackageInfo: params}));
        props.closeModal(true);
      }
    });
  };

  const handleSelectPath = () => {
    pyramidUiService.sendMessageFn(new PyramidUISendProjectChoosePathAction());
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
      <div className="ant-upload-text">上传图片</div>
    </div>
  );

  return (
    <Modal
      destroyOnClose={true}
      title="新建"
      width={800}
      visible={props.modalVisible}
      footer={null}
      onCancel={() => props.closeModal()}>

      <Form onSubmit={handleSubmit}>
        <FormItem label='英文名称'>
          {getFieldDecorator(`menuNameEn`, {
            rules: [
              { required: true, message: '必填' },
              // {
              //   validator: validateEnglishnName,
              // }
            ],
          })(<Input placeholder="英文名称" />)}
        </FormItem>

        <FormItem label='中文名称'>
          {getFieldDecorator(`menuNameZh`, {
            rules: [
              { required: true, message: '必填' },
              // {
              //   validator: validateChineseName,
              // }
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label='目录'>
          {getFieldDecorator(`filePath`, {
            rules: [
              { required: true, message: '必填' }
            ],
          })(<Input placeholder="请选择" onClick={() => handleSelectPath()}/>)}
        </FormItem>

        <FormItem label='包管理器'>
          {getFieldDecorator('package', { initialValue: pkgmtOptions[0].value })(
            <Select
              placeholder="请选择"
              allowClear={false}
            >
              {pkgmtOptions.map(data => {
                return (
                  <Select.Option value={data.value} key={data.value}>
                    {data.label}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </FormItem>

        <FormItem label='类型'>
          {getFieldDecorator('applyType', { initialValue: templetOptions[0].extraValue })(
            <Select
              placeholder="请选择"
              allowClear={false}
            >
              {templetOptions.map(data => {
                return (
                  <Select.Option value={data.extraValue} key={data.extraValue}>
                    {data.label}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </FormItem>

        <FormItem label='图片' extra='只支持.jpg格式'>
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

