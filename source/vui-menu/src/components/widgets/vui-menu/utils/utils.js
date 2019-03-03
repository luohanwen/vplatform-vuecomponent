export default {
	/**
	 * 将id，pid类型数据转换tree数据
	 * @param {*} data
	 */
	toTree(data, idKeyName, pidKeyName) {
		// 删除 所有 children,以防止多次调用
		data.forEach(function(item) {
			delete item.children;
		});

		// 将数据存储为 以 id 为 KEY 的 map 索引数据列
		var map = {};
		data.forEach(function(item) {
			map[item[idKeyName]] = item;
		});
		//        console.log(map);

		var val = [];
		data.forEach(item => {
			// 以当前遍历项，的pid,去map对象中找到索引的id
            var parent = map[item[pidKeyName]];
            
            //获取节点在树里的深度
            var treeDepth = this.getTreeDepth(map,item,pidKeyName);
            item.treeDepth = treeDepth;

			// 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
			if (parent) {
				(parent.children || (parent.children = [])).push(item);
			} else {
				//如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
				val.push(item);
			}
		});

		return val;
	},
	/**
	 * 获取节点在树里的深度 根节点为1 后面的依次加1
	 */
	getTreeDepth(idMap, node, pidKeyName) {
		let depth = 1;
		let depthHandle = item => {
			let parent = idMap[item[pidKeyName]];
			if (parent) {
				depth = depth + 1;
				depthHandle(parent);
			}
		};
		depthHandle(node);
		return depth;
	},
	/**
	 * 将id，pid类型数据转换tree数据
	 * @param {*} data
	 */
	toTreeSpecial(data, idKeyName, pidKeyName) {
		// 删除 所有 children,以防止多次调用
		data.forEach(function(item) {
			delete item.children;
		});

		// 将数据存储为 以 id 为 KEY 的 map 索引数据列
		var map = {};
		var val = [];
		data.forEach(function(item) {
			map[item[idKeyName]] = item;
			if (item[pidKeyName] == '') {
				val.push(item);
			}
		});

		val.forEach(p => {
			p.children = [];
			data.forEach(item => {
				// 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
				if (p[idKeyName] == item[pidKeyName]) {
					item.children = [];
					// 将所有子菜单归集到2级菜单下
					let dd = this.getAllLeafNode(
						data,
						item,
						idKeyName,
						pidKeyName
					);
					item.children = dd;
					p.children.push(item);
				}
			});
		});

		return val;
	},
	//获取所有叶子节点
	getAllLeafNode(sourceData, parent, idKeyName, pidKeyName) {
		var val = [];
		var _getLeaf = function(data, p) {
			data.forEach(item => {
				if (item[pidKeyName] == p[idKeyName]) {
					if (
						data.filter(o => o[pidKeyName] == item[idKeyName])
							.length > 0
					) {
						_getLeaf(sourceData, item);
					} else {
						val.push(item);
					}
				}
			});
		};
		_getLeaf(sourceData, parent);

		return val;
	}
};
