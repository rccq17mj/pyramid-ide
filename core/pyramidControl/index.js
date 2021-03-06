var fs = require('fs');

const Datastore = require('nedb'), db = new Datastore({
  filename: 'public/projects.db',
  autoload: true
}), blockdb = new Datastore({
  filename: 'public/blocks.db',
  autoload: true
}), block_itemdb = new Datastore({
  filename: 'public/block_item.db',
  autoload: true
}), blocks_typedb = new Datastore({
  filename: 'public/blocks_type.db',
  autoload: true
}), now_use_project_db = new Datastore({
  filename: 'public/now_projects.db',
  autoload: true
}), private_block_package_db = new Datastore({ // 私有区块包，存在本地
  filename: 'public/private_block_package.db',
  autoload: true
});

const DataUse = require("./dataUse");

class cliBridge {

  constructor() {
    this.projectInfo = {}
    this.moduleInfo = {}
    this.runWindow = {};
    this.layoutInfo = {}
  }

  /**
   * 取得当前项目的信息
   * @param {*} callback
   */
  getNowProjectInfo(callback) {
    now_use_project_db.findOne({}, (err, ret) => {
      if (err) {
        callback(-1)
      }
      if (ret) {
        callback(ret)
      }
    })
  }


  /**
   * 更新当前项目的信息
   * @param {*} projectInfo
   */
  updataProjectInfo(projectInfo, callback) {
    // 获取模版工程的版本号
    fs.readFile(`${projectInfo.path}/${projectInfo.name}/package.json`, 'utf-8', (err, data) => {
      if (err) {
        if (err) console.log('获取应用"/package.json"文件失败 error:', err)
        callback(false);
      } else {
        now_use_project_db.remove({}, {
          multi: true
        }, (err, ret) => {
          const {name, version} = JSON.parse(data);
          projectInfo.package = {name, version};
          now_use_project_db.insert(projectInfo, (err, ret) => {
            if (err) {
              console.log('写入运行环境文件"now_projects.db" 失败 err:', err);
              callback(false);
            } if (ret) {
              this.getNowProjectInfo((projectInfo) => {
                console.log('当前运行项目信息:', projectInfo);
              })
              callback(true);
            }
          });
        });
      }
    });
  }

  /**
   * 删除项目
   * @param {*} projectNames
   * @param {*} callback
   */
  removeProjects(projectNames, callback) {
    if (Array.isArray(projectNames)) {
      const lastName = projectNames[projectNames.length - 1];
      projectNames.map((item) => {
        // 移除相应信息
        new DataUse(db).remove({ name: item }).then(msg => {
          if (item == lastName) {
            console.log('移除成功')
            callback(1);
          }
        }).catch(e => {
          console.log('移除失败')
          callback(-1);
        })

      })
    }
  }

  /**
   * 删除区块包
   * @param {*} projectNames
   * @param {*} callback
   */
  removeBlock(id, callback) {
    if (Array.isArray(id)) {
      const lastId = id[id.length - 1];
      id.map((item) => {
        // 移除相应信息
        new DataUse(blockdb).remove({ _id: item }).then(msg => {
          console.log('移除后的msg', msg)
          if (item == lastId) {
            console.log('移除成功')
            callback(1);
          }
        }).catch(e => {
          console.log('移除失败')
          callback(-1);
        })

      })
    }
  }

  /**
   * 启动项目
   * @param {*} projectInfo
   * @param {*} callback
   */
  start(projectInfo, runWindow) {
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: 'cross-env BROWSER=none yarn start:pyramid-ui',
      cwd: `${projectInfo.path}/${projectInfo.name}`,
      flag: 'cmd-children-project-start'
    };

    console.log('projectStart:', cmdArg);
    // 发送启动命令
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
  * 区块
  */
  clickSection(blockInfo, runWindow, projectInfo) {
    // 用项目信息拼接创建执行命令
    const path_array = blockInfo.filename.split('/pages');
    const path = path_array[path_array.length - 1].split('.')[0]
    const gitUrl = JSON.parse(blockInfo.data).gitUrl;
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `pyramid block add ${gitUrl} --path=${path} --index=${blockInfo.index}`,
      cwd: `${projectInfo.path}/${projectInfo.name}`,
      flag: 'cmd-children-project-block-create'
    };
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 创建区块包
   */
  createBlock(blockInfo, runWindow) {
    // 保存区块信息
    new DataUse(blockdb).save(blockInfo).then(msg => { });

    let cmd = `pyramid block-package init ${blockInfo.menuNameEn} --init-project-type=${blockInfo.applyType} --init-project-chinese-name=${blockInfo.menuNameZh}`;

    if (blockInfo.remarkImg) {
      cmd += ` --initProjectCover=${blockInfo.remarkImg}`;
    }

    // 用项目信息拼接创建执行命令
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: cmd,
      cwd: `${blockInfo.filePath}`,
      flag: 'cmd-block-package-create'
    };

    console.log('createBlock-cmdArg', cmdArg);
    // 将此命令发送给渲染窗口执行
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 创建区块
   */
  createBlockItem(blockInfo, runWindow) {
    // 用项目信息拼接创建执行命令
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `pyramid block create ${blockInfo.blockName} --create-block-name-zh=${blockInfo.blockNameZn} --create-block-type=${blockInfo.blockType} --create-block-description=${blockInfo.blockDescription} --create-block-categories=${blockInfo.blockCategories} --create-block-image=${blockInfo.blockImage}`,
      cwd: `${blockInfo.projectPath}`,
      flag: 'cmd-block-item-create',
    };

    // 将此命令发送给渲染窗口执行
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 区块发布
   * @param blockPackageInfo
   * @param runWindow
   */
  publishBlockPackage(blockPackageInfo, runWindow) {
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `pyramid block-package update --update-project-path=${blockPackageInfo.projectPath} --update-project-git-url=${blockPackageInfo.gitUrl}`,
      cwd: ``,
      flag: 'cmd-block-package-publish',
    };

    // 将此命令发送给渲染窗口执行
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 创建区块分类
   */
  createBlocksType(blocksTypeInfo, runWindow) {
    // 保存区块信息  暂时不保存在本地
    //  new DataUse(blocks_typedb).save(blocksTypeInfo).then(msg=>{})

    // 用项目信息拼接创建执行命令
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `pyramid block category add ${blocksTypeInfo.name} --category-type=${blocksTypeInfo.categoryType}`,
      cwd: `${blocksTypeInfo.projectPath}`,
      flag: 'cmd-blocks-type-create',
    };

    // 将此命令发送给渲染窗口执行
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
  * 布局
  */
  createLayout(layoutInfo, runWindow, projectInfo) {

    // 用项目信息拼接创建执行命令
    const path_array = layoutInfo.filename.split('/pages');
    const path = path_array[path_array.length - 1].split('.')[0]
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `pyramid block add https://github.com/guccihuiyuan/pyramid-blocks/tree/master/layouts/grid-basic-${layoutInfo.column} --path=${path} --index=${layoutInfo.index}`,
      cwd: `${projectInfo.path}/${projectInfo.name}`,
      flag: 'cmd-children-project-layout-create'
    }
    console.log('--Layout-cmdArg--', cmdArg)

    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
  * 创建模块
  */
  createModule(moduleInfo, runWindow, projectInfo) {
    const gitUrl = moduleInfo.gitUrl;
    // 用项目信息拼接创建执行命令
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `pyramid block add ${gitUrl} --page --path=${moduleInfo.filePath} --route-path=${moduleInfo.routePath} --route-name=${moduleInfo.menuNameEn}`,
      cwd: `${projectInfo.path}/${projectInfo.name}`,
      flag: 'cmd-children-project-module-create'
    }
    console.log('--module-cmdArg--', cmdArg);

    // const cmdStr        = `${projectPath} pyramid block add https://github.com/guccihuiyuan/pyramid-blocks/tree/master/templates/EmptyPage --page --path=${this.moduleInfo.filePath} --route-path=${this.moduleInfo.routePath} --route-name=${this.moduleInfo.menuNameEn}`;
    // 将此命令发送给渲染窗口执行
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 获取路由树
   * @param runWindow
   * @param projectInfo
   */
  getProjectRouteTree(runWindow, projectInfo) {
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `pyramid config routes getPathTree`,
      cwd: `${projectInfo.path}/${projectInfo.name}`,
      flag: 'cmd-children-project-get-route-tree'
    };
    // 将此命令发送给渲染窗口执行
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 获取区块包信息
   * @param runWindow
   * @param payload
   */
  getBlockPackageInfo(runWindow, payload) {
    let cmdStr = '';
    if (payload.projectGitUrl) {
      cmdStr = `pyramid block-package get --get-project-url=${payload.projectGitUrl} --get-project-branch=${payload.projectGitBranch}`;
    } else if (payload.projectPath) {
      cmdStr = `pyramid block-package get --get-project-path=${payload.projectPath}`;
    }

    // 额外参数，需要回传
    const projectId = payload.projectId;

    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: cmdStr,
      cwd: '',
      flag: 'cmd-get-block-package-info',
      projectId: projectId
    };
    // 将此命令发送给渲染窗口执行
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 创建项目
   */
  createProject(projectInfo, runWindow) {
    // pyramid init temp1 --skip-inquirer --project-type=PC projectManager=yarn

    // 保存项目信息
    if (projectInfo.hasOwnProperty('name')) {
      new DataUse(db).save(projectInfo).then(() => { });
    }

    // 用项目信息拼接创建执行命令
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `pyramid init ${projectInfo.name} --skip-inquirer —package-manage=${projectInfo.pkgmt} --project-url=direct:${projectInfo.template}`,
      cwd: `${projectInfo.path}`,
      flag: 'cmd-children-project-create'
    };

    // 将此命令发送给渲染窗口执行
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 导入项目
   * @param {*} projectInfo 
   * @param {*} runWindow 
   */
  importProject(projectInfo, runWindow) {
    const info = {
      path: projectInfo.import_path,
      name: projectInfo.import_name,
      name_cn: projectInfo.import_name_cn,
      platform: projectInfo.platform,
      pkgmt: projectInfo.import_pkgmt
    }
    if (info.hasOwnProperty('name')) {
      new DataUse(db).save(info).then(() => { });
    }
    const cmdArg = {
      channel: 'cmd-message',
      cmdStr: `${info.pkgmt} install`,
      cwd: `${info.path}/${info.name}`,
      flag: 'cmd-children-project-import'
    };
    runWindow.webContents.send('cmd-message', cmdArg);
  }

  /**
   * 查找全部项目
   * @param option
   * @param callback
   */
  findProject(option, callback) {
    new DataUse(db).getRows(option).then(rows => {
      if (rows.length > 0) {
        callback(rows);
      } else {
        callback([]);
      }
    }).catch(() => {
      callback([]);
    })
  };

  /**
   * 查找全部区块包
   * @param {*} callback
   */
  findBlock(callback) {
    new DataUse(blockdb).getRows({}).then(rows => {
      if (rows.length > 0) {
        callback(rows);
      } else {
        callback([]);
      }
    }).catch(e => {
      callback([]);
    })
  }

  /**
   * 私有区块包插入
   * @param blockPackageInfo
   * @param callback
   */
  insertPrivateBlockPackage = (blockPackageInfo, callback) => {
    const condition = {
      blockPackageGitUrl: blockPackageInfo.blockPackageGitUrl
    };
    private_block_package_db.findOne(condition, (err, result) => {
      if (err) {
        callback(err || null);
        return;
      }
      if (result) {
        callback('已经存在该区块包信息');
        return;
      }
      private_block_package_db.insert(blockPackageInfo, (err) => {
        callback(err || null);
      });
    });
  };

  /**
   * 查找所有区块包信息
   * @param callback
   */
  findPrivateBlockPackageList = (callback) => {
    private_block_package_db.find({}, (err, rows) => {
      if (err) {
        callback([]);
        return;
      }
      callback(rows);
    });
  };

  /**
   * 批量删除
   * @param ids
   * @param callback
   */
  deletePrivateBlockPackage = (ids, callback) => {
    const condition = ids.map(v => {
      return { _id: v }
    });
    private_block_package_db.remove({ $and: condition }, { multi: true }, (err, numRemoved) => {
      if (err) {
        callback('数据删除失败');
        return;
      }
      // 好像不能把数据删除掉，只能做一个标识，要更新下数据把字段都清掉，不然太多了
      callback(null);
    });
  };

  /**
   * 查找全部区块
   * @param {*} callback
   */
  /*      findBlockItem(callback) {
            new DataUse(block_itemdb).getRows({}).then(rows => {
                if(rows.length > 0){
                    callback(rows);
                }else {
                    callback([]);
                }
            }).catch(e=>{
                callback([]);
            })
        }*/

  // /**
  //  * 项目保存
  //  * @param {*} projectRow
  //  */
  // saveProject(projectRow) {

  //   db.insert(projectRow, (err, ret) => {
  //     if (err) console.log('err', err)
  //     if (ret) {
  //       console.log('ret:', ret);
  //     }
  //   });
  // }

  // /**
  //  * 区块保存
  //  * @param {*} projectRow
  //  */
  // saveBlock(projectRow) {
  //   blockdb.insert(projectRow, (err, ret) => {
  //       if (err) console.log('err', err)
  //       if (ret) {
  //           console.log('BlockRet:', ret);
  //       }
  //   });
  // }

}
module.exports = cliBridge
