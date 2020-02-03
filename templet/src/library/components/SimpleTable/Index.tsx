// import React, { FunctionComponent, useEffect, useState } from 'react';
// import { Alert, Table } from 'antd';
// import { PaginationConfig, TableRowSelection } from 'antd/lib/table';
// import { httpService } from '@react-kit/http';
//
// interface IProps {
//   rowKey?: string;
//   // 列配置
//   columns: any[];
//   // 请求地址
//   url?: string | null;
//   // 数据源
//   dataSource?: any[];
//   // 总数
//   total?: number;
//   // 请求方法
//   reqMethod?: 'GET' | 'POST' | 'DELETE' | 'PUT';
//   // 请求头
//   reqHeader?: any;
//   // 额外参数
//   extraParams?: object;
//   // 是否初始化加载数据
//   initLoadData?: boolean;
//   // 重命名请求参数
//   reqReName?: {
//     page?: {
//       pageNo?: string;
//       pageSize?: string;
//     }
//   },
//   // 重命名响应参数
//   resReName?: {
//     list?: string;
//     total?: string;
//   },
//   // 处理response数据
//   preResponseDataChange?: (data: any) => any;
//   // 处理data
//   preDataChange?: (data: any[]) => any[];
//   // 是否显示分页
//   showPagination?: boolean;
//   // 勾选类型
//   rowSelectionType?: null | 'checkbox' | 'radio';
//   // 选中行事件
//   onSelectRow?: (data: any[]) => void;
//   // 是否显示序号
//   showOrderNumber?: boolean;
// }
//
// const Component: FunctionComponent<IProps> = props => {
//   // 处理序号列
//   const numberColumns = [
//     {
//       title: '序号',
//       dataIndex: 'tableOrderNumber',
//       key: 'tableOrderNumber',
//       render: (text, record, index) => {
//         return (current - 1) * (pageSize) + index + 1;
//       }
//     }
//   ];
//   // 是否显示序号
//   const showOrderNumber = props.showOrderNumber === undefined ? true : props.showOrderNumber;
//   const columns = showOrderNumber ? props.columns ? [...numberColumns, ...props.columns] : numberColumns : props.columns || [];
//
//   // 合并处理的props
//   const mergeProps: IProps = {
//     rowKey: props.rowKey || 'id',
//     columns,
//     url: props.url || null,
//     dataSource: props.dataSource || [],
//     total: props.total || 0,
//     reqMethod: props.reqMethod || 'GET',
//     reqHeader: props.reqHeader || null,
//     extraParams: props.extraParams || null,
//     initLoadData: props.initLoadData === undefined ? true : props.initLoadData,
//     reqReName: {
//       page: {
//         pageNo: (props.reqReName && props.reqReName.page && props.reqReName.page.pageNo) || 'pageNo',
//         pageSize: (props.reqReName && props.reqReName.page && props.reqReName.page.pageSize) || 'pageSize'
//       }
//     },
//     resReName: {
//       list: (props.resReName && props.resReName.list) ? props.resReName.list : 'list',
//       total: (props.resReName && props.resReName.total) ? props.resReName.total : 'total'
//     },
//     preResponseDataChange: props.preResponseDataChange || null,
//     preDataChange: props.preDataChange || null,
//     showPagination: props.showPagination === undefined ? true : props.showPagination,
//     rowSelectionType: props.rowSelectionType || null,
//     onSelectRow: props.onSelectRow || null
//   };
//
//   // useState
//   const [dataSource, setDataSource] = useState<any[]>(mergeProps.dataSource ? mergeProps.dataSource : []);
//   const [total, setTotal] = useState<number>(mergeProps.total ? mergeProps.total : 0);
//   const [extraParams, setExtraParams] = useState<object>(mergeProps.extraParams);
//   const [current, setCurrent] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number>(10);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [initComplete, setInitComplete] = useState<boolean>(false);
//   // 选中数据
//   const [selectedDataSource, setSelectedDataSource] = useState<any[]>([]);
//   const [selectedDataSourceKeys, setSelectedDataSourceKeys] = useState<any[]>([]);
//
//   // 通过比对两次参数是否改变，判断是否需要重新渲染
//   if (initComplete && mergeProps.extraParams !== null && extraParams !== mergeProps.extraParams) {
//     // 更新
//     setExtraParams(mergeProps.extraParams);
//   }
//
//   // 额外参数改变
//   useEffect(() => {
//     if (!initComplete) {
//       return;
//     }
//     // 远程加载数据
//     if (mergeProps.url) {
//       if (current === 1) {
//         requestDataSource();
//       } else {
//         setCurrent(1);
//       }
//     }
//   }, [extraParams]);
//
//   // current改变
//   useEffect(() => {
//     if (!initComplete) {
//       return;
//     }
//     // 远程加载数据
//     if (mergeProps.url && mergeProps.showPagination) {
//       // 请求数据
//       requestDataSource();
//     }
//   }, [current]);
//
//   // pageSize改变
//   useEffect(() => {
//     if (!initComplete) {
//       return;
//     }
//     // 远程加载数据
//     if (mergeProps.url && mergeProps.showPagination) {
//       // 请求数据
//       setCurrent(1);
//     }
//   }, [pageSize]);
//
//   // 初始化
//   useEffect(() => {
//     // 初始化完成
//     setInitComplete(true);
//
//     // 远程加载数据
//     if (mergeProps.url && mergeProps.initLoadData) {
//       // 请求数据
//       requestDataSource();
//     }
//   }, []);
//
//   // 生成公共参数
//   const generateCommonParams = () => {
//     const totalParams = {...props.extraParams || {}};
//     if (mergeProps.showPagination) {
//       totalParams[mergeProps.reqReName.page.pageNo] = current;
//       totalParams[mergeProps.reqReName.page.pageSize] = pageSize;
//     }
//     return totalParams;
//   };
//
//   // 深层遍历
//   const deepGet = (obj, path = '') => {
//     if (!path) {
//       return null;
//     }
//     // 将字符串转换成数组
//     const arrayPath = path.split('.');
//
//     let tempObj = obj;
//
//     arrayPath.forEach(pathStr => {
//       try {
//         tempObj = tempObj[pathStr]
//       } catch (e) {
//         tempObj = null;
//       }
//     });
//
//     return tempObj;
//   };
//
//   // 请求数据
//   const requestDataSource = () => {
//     const params = generateCommonParams();
//
//     const options = mergeProps.reqHeader !== null ? { headers: mergeProps.reqHeader } : { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
//
//     setLoading(true);
//     httpService.request(mergeProps.reqMethod, mergeProps.url, params, options).then(res => {
//       setLoading(false);
//
//       if (res.flag) {
//         let httpResponseData = res.data;
//
//         if (mergeProps.preResponseDataChange) {
//           httpResponseData = mergeProps.preResponseDataChange(httpResponseData);
//         }
//
//         // 数据源
//         let responseDataSource = deepGet(httpResponseData, mergeProps.resReName.list);
//         if (responseDataSource === null) {
//           responseDataSource = [];
//         }
//         if (mergeProps.preDataChange) {
//           responseDataSource = mergeProps.preDataChange(responseDataSource);
//         }
//
//         // 总数
//         const responseTotal = deepGet(httpResponseData, mergeProps.resReName.total) || 0;
//
//         // 设置数据
//         setDataSource(responseDataSource);
//         setTotal(responseTotal);
//       }
//     });
//   };
//
//   // 页码改变
//   const onChange = (pageInfo: PaginationConfig) => {
//     setCurrent(pageInfo.current);
//     setPageSize(pageInfo.pageSize);
//   };
//
//   const rowSelection: TableRowSelection<any> = {
//     type: mergeProps.rowSelectionType,
//     selectedRowKeys: selectedDataSourceKeys,
//     onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
//       // 1.先从数组中去掉该页的所有数据
//       // 选中的dataSource
//       const sds = [];
//       selectedDataSource.forEach(v => {
//         let canAdd = true;
//
//         dataSource.forEach(data => {
//           if ((data[mergeProps.rowKey]).toString() === (v[mergeProps.rowKey]).toString()) {
//             canAdd = false;
//           }
//         });
//
//         if (canAdd) {
//           sds.push(v);
//         }
//       });
//
//       const resultSds = [...sds, ...selectedRows];
//       setSelectedDataSourceKeys([...selectedRowKeys]);
//       setSelectedDataSource(resultSds);
//       if (mergeProps.onSelectRow) {
//         mergeProps.onSelectRow(resultSds);
//       }
//     }
//   };
//
//   const clearAllSelect = () => {
//     setSelectedDataSourceKeys([]);
//     setSelectedDataSource([]);
//   };
//
//   return (
//     <>
//       {mergeProps.rowSelectionType ?
//         <div style={{marginBottom: 20}}>
//           <Alert style={{marginTop: 20}} message={<div><span>已选择 <a>{selectedDataSourceKeys.length}</a> 项</span> <a onClick={() => clearAllSelect()}>清空</a></div>} type="info" showIcon={true} />
//         </div> : null
//       }
//       <Table
//         rowKey={mergeProps.rowKey}
//         columns={mergeProps.columns}
//         dataSource={dataSource}
//         loading={loading}
//         pagination={mergeProps.showPagination ? {
//           current,
//           pageSize,
//           total,
//           showTotal: (v: number) => `共 ${v} 条`,
//           showQuickJumper: true,
//           showSizeChanger: true
//         }: false}
//         onChange={onChange}
//         rowSelection={mergeProps.rowSelectionType ? rowSelection : null}
//       />
//     </>
//   )
// };
//
// export default Component;

import React from 'react';
import { Alert, Table } from 'antd';
import { PaginationConfig, TableRowSelection } from 'antd/lib/table';
import { httpService } from '@react-kit/http';

interface IProps {
  rowKey?: string;
  // 列配置
  columns: any[];
  // 请求地址
  url?: string | null;
  // 数据源
  dataSource?: any[];
  // 总数
  total?: number;
  // 请求方法
  reqMethod?: 'GET' | 'POST' | 'DELETE' | 'PUT';
  // 请求头
  reqHeader?: any;
  // 额外参数
  extraParams?: object;
  // 是否初始化加载数据
  initLoadData?: boolean;
  // 重命名请求参数
  reqReName?: {
    page?: {
      pageNo?: string;
      pageSize?: string;
    };
  };
  // 重命名响应参数
  resReName?: {
    list?: string;
    total?: string;
  };
  // 处理response数据
  preResponseDataChange?: (data: any) => any;
  // 处理data
  preDataChange?: (data: any[]) => any[];
  // 是否显示分页
  showPagination?: boolean;
  // 勾选类型
  rowSelectionType?: null | 'checkbox' | 'radio';
  // 选中行事件
  onSelectRow?: (data: any[]) => void;
  // 是否显示序号
  showOrderNumber?: boolean;
}

interface IStatus {
  dataSource: any[];
  total: number;
  current: number;
  pageSize: number;
  loading: boolean;
  selectedDataSource: any[];
  selectedDataSourceKeys: any[];
}

export default class SimpleTable extends React.Component<IProps, IStatus> {
  // 默认配置
  static defaultProps: IProps = {
    rowKey: 'id',
    columns: [],
    url: null,
    dataSource: [],
    total: 0,
    reqMethod: 'GET',
    extraParams: null,
    initLoadData: true,
    reqReName: {
      page: {
        pageNo: 'pageNo',
        pageSize: 'pageSize',
      },
    },
    resReName: {
      list: 'list',
      total: 'total',
    },
    preResponseDataChange: null,
    preDataChange: null,
    showPagination: true,
    rowSelectionType: null,
    onSelectRow: null,
  };

  constructor(props: any) {
    super(props);

    // 初始化状态
    this.state = {
      dataSource: this.props.dataSource ? this.props.dataSource : [],
      total: this.props.total ? this.props.total : 0,
      current: 1,
      pageSize: 10,
      loading: false,
      selectedDataSource: [],
      selectedDataSourceKeys: [],
    };
  }

  componentDidMount(): void {
    // 远程加载数据
    if (this.props.url && this.props.initLoadData) {
      // 请求数据
      this.requestDataSource();
    }
  }

  // componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IStatus>, snapshot?: any): void {
  //   if (this.props.url) {
  //     if (!(_.isEqual(prevProps.extraParams, this.props.extraParams))) {
  //       this.requestDataSource();
  //     }
  //   }
  // }

  // 公共方法
  // 清空所有选项
  clearAllSelect = () => {
    this.setState({
      selectedDataSourceKeys: [],
      selectedDataSource: [],
    });
  };

  // 全选
  selectAll = () => {
    this.setState({
      selectedDataSourceKeys: this.state.dataSource.map(v => v[this.props.rowKey]),
      selectedDataSource: this.state.dataSource,
    });
    if (this.props.onSelectRow) {
      this.props.onSelectRow(this.state.dataSource);
    }
  };

  // 加载数据
  loadData = (params: { resetCurrent: boolean } = { resetCurrent: false }) => {
    if (this.props.url) {
      if (params && params.resetCurrent) {
        this.setState({ current: 1 }, () => {
          this.requestDataSource();
        });
      } else {
        this.requestDataSource();
      }
    } else {
      this.setState({
        dataSource: this.props.dataSource,
      });
    }
  };

  // 删除数据后刷新表格(暂时只处理删除一条数据的情况)
  deleteAndLoadData = (selectRecords: number = 1) => {
    const laseCurrent = this.state.current;

    if (selectRecords === 1) {
      if (this.state.dataSource.length - selectRecords <= 0) {
        if (selectRecords === 1) {
          this.setState({ current: laseCurrent - 1 > 0 ? laseCurrent - 1 : 1 }, () => {
            this.requestDataSource();
          });
        }
      } else {
        this.requestDataSource();
      }
    } else {// 批量的或0
      this.setState({ current: 1 }, () => {
        this.requestDataSource();
      });
    }
  };
  // 公共方法

  // 私有方法
  // 生成公共参数
  generateCommonParams = () => {
    const { current, pageSize } = this.state;

    const totalParams = { ...(this.props.extraParams || {}) };

    // 分页
    if (this.props.showPagination) {
      let pageNoName = 'pageNo';
      let pageSizeName = 'pageSize';
      if (this.props.reqReName && this.props.reqReName.page && this.props.reqReName.page.pageNo) {
        pageNoName = this.props.reqReName.page.pageNo;
      }
      if (this.props.reqReName && this.props.reqReName.page && this.props.reqReName.page.pageSize) {
        pageSizeName = this.props.reqReName.page.pageSize;
      }
      totalParams[pageNoName] = current;
      totalParams[pageSizeName] = pageSize;
    }

    return totalParams;
  };

  // 深层遍历
  deepGet = (obj, path = '') => {
    if (!path) {
      return null;
    }
    // 将字符串转换成数组
    const arrayPath = path.split('.');

    let tempObj = obj;

    arrayPath.forEach(pathStr => {
      try {
        tempObj = tempObj[pathStr];
      } catch (e) {
        tempObj = null;
      }
    });

    return tempObj;
  };

  // 请求数据
  requestDataSource = () => {
    const params = this.generateCommonParams();

    const options = this.props.reqHeader
      ? { headers: this.props.reqHeader }
      : { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

    this.setState({
      loading: true,
    });
    httpService.request(this.props.reqMethod, this.props.url, params, options).then(res => {
      this.setState({
        loading: false,
      });

      if (res.flag) {
        let httpResponseData = res.data;

        if (this.props.preResponseDataChange) {
          httpResponseData = this.props.preResponseDataChange(httpResponseData);
        }

        // 数据源
        let listName = 'list';
        if (this.props.resReName && this.props.resReName.list) {
          listName = this.props.resReName.list;
        }
        let responseDataSource = this.deepGet(httpResponseData, listName);
        if (responseDataSource === null) {
          responseDataSource = [];
        }
        if (this.props.preDataChange) {
          responseDataSource = this.props.preDataChange(responseDataSource);
        }

        // 总数
        let totalName = 'total';
        if (this.props.resReName && this.props.resReName.total) {
          totalName = this.props.resReName.total;
        }
        const responseTotal = this.deepGet(httpResponseData, totalName) || 0;

        // 设置数据
        this.setState({
          dataSource: responseDataSource,
          total: responseTotal,
        });
      } else {
        // 清空
        this.setState({
          dataSource: [],
          total: 0,
        });
      }
    });
  };

  // 页码改变
  onChange = (pageInfo: PaginationConfig) => {
    let current = pageInfo.current;

    if (this.props.url && this.props.showPagination) {
      if (pageInfo.pageSize !== this.state.pageSize) {
        // 只要页数改变，就重回第一页
        current = 1;
      }
    }

    this.setState(
      {
        current,
        pageSize: pageInfo.pageSize,
      },
      () => {
        // 重新请求
        if (this.props.url && this.props.showPagination) {
          this.requestDataSource();
        }
      }
    );
  };

  rowSelection = (): TableRowSelection<any> => {
    const { selectedDataSource, dataSource } = this.state;

    return {
      type: this.props.rowSelectionType,
      selectedRowKeys: this.state.selectedDataSourceKeys,
      onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
        // 1.先从数组中去掉该页的所有数据
        // 选中的dataSource
        const sds = [];
        selectedDataSource.forEach(v => {
          let canAdd = true;

          dataSource.forEach(data => {
            if (data[this.props.rowKey].toString() === v[this.props.rowKey].toString()) {
              canAdd = false;
            }
          });

          if (canAdd) {
            sds.push(v);
          }
        });

        const resultSds = [...sds, ...selectedRows];

        this.setState(
          {
            selectedDataSource: resultSds,
            selectedDataSourceKeys: [...selectedRowKeys],
          },
          () => {
            if (this.props.onSelectRow) {
              this.props.onSelectRow(resultSds);
            }
          }
        );
      },
    };
  };

  // 处理columns
  getColumns = () => {
    // 处理序号列
    const numberColumns = [
      {
        title: '序号',
        dataIndex: 'tableOrderNumber',
        key: 'tableOrderNumber',
        render: (text, record, index) => {
          return (this.state.current - 1) * this.state.pageSize + index + 1;
        },
      },
    ];

    const showOrderNumber =
      this.props.showOrderNumber === undefined ? true : this.props.showOrderNumber;

    return showOrderNumber
      ? this.props.columns
        ? [...numberColumns, ...this.props.columns]
        : numberColumns
      : this.props.columns || [];
  };
  // 私有方法

  render(): React.ReactNode {
    const { current, pageSize, total, selectedDataSourceKeys } = this.state;

    return (
      <>
        {this.props.rowSelectionType ? (
          <div style={{ marginBottom: 20 }}>
            <Alert
              style={{ marginTop: 20 }}
              message={
                <div>
                  <span>
                    已选择 <a>{selectedDataSourceKeys.length}</a> 项
                  </span>{' '}
                  <a onClick={() => this.clearAllSelect()}>清空</a>
                </div>
              }
              type="info"
              showIcon={true}
            />
          </div>
        ) : null}
        <Table
          rowKey={this.props.rowKey}
          columns={this.getColumns()}
          dataSource={this.state.dataSource}
          loading={this.state.loading}
          pagination={
            this.props.showPagination
              ? {
                  current,
                  pageSize,
                  total,
                  showTotal: (v: number) => `共 ${v} 条`,
                  showQuickJumper: true,
                  showSizeChanger: true,
                }
              : false
          }
          onChange={this.onChange}
          rowSelection={this.props.rowSelectionType ? this.rowSelection() : null}
        />
      </>
    );
  }
}
