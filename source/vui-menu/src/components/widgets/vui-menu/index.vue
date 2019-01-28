<script>
import Menu from "./components/menu/index";
import Utils from "./utils/utils";
export default {
    name: "vui-menu",
    props: {
        dataSource: {
            type: Array,
            default: () => []
        },
        nameField: {
            type: String
        },
        titleField: {
            type: String
        },
        pnameField: {
            type: String
        },
        iconField: {
            type: String
        },
        groupKeyField: {
            type: String
        },
        groupTitleField: {
            type: String
        },
        mode: {
            type: String,
            default: "vertical"
        },
        accordion: {
            type: Boolean,
            default: true
        },
        fullscreen: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            default: "light"
        },
        width: {
            type: String,
            default: "220px"
        },
        collapse: {
            type: Boolean,
            default: false
        },
        activeName: {
            type: String,
            default: ""
        },
        openNames: {
            type: Array,
            default: () => []
        }
    },
    render(h) {
        //第一列菜单有icon
        let getMenuContent = item => {
            let iconType = item[this.iconField];
            let title = item[this.titleField];
            let pid = item[this.pnameField];
            console.log(iconType, pid, title);
            //有icon并且是第一级菜单
            if (iconType && (pid === "" || pid === undefined)) {
                return [
                    h("Icon", { attrs: { type: iconType } }),
                    h("span", title)
                ];
            } else {
                return title;
            }
        };
        //获取横向全屏的html
        let getHorizontalFullscreen = data => {
            return data.map((item, index) => {
                if (item.children && item.children.length) {
                    //1级菜单
                    if (!item.pid) {
                        return h(
                            "Submenu",
                            {
                                attrs: {
                                    name: item[this.nameField]
                                }
                            },
                            [
                                h(
                                    "template",
                                    {
                                        slot: "title"
                                    },
                                    getMenuContent(item)
                                ),
                                getItemTree(item.children)
                            ]
                        );
                    } else {
                        return h(
                            "MenuGroup",
                            {
                                attrs: {
                                    title: item[this.titleField]
                                }
                            },
                            [getItemTree(item.children)]
                        );
                    }
                } else {
                    return h(
                        "MenuItem",
                        {
                            attrs: {
                                name: item[this.nameField]
                            }
                        },
                        getMenuContent(item)
                    );
                }
            });
        };
        let getItemTree = data => {
            //横向全屏
            if (this.mode == "horizontal" && this.fullscreen) {
                return getHorizontalFullscreen(data);
            } else {
                return data.map((item, index) => {
                    if (item.children && item.children.length) {
                        if (item[this.groupKeyField]) {
                            return h(
                                "MenuGroup",
                                {
                                    attrs: {
                                        title: item[this.groupTitleField]
                                    }
                                },
                                [getItemTree(item.children)]
                            );
                        } else {
                            return h(
                                "Submenu",
                                {
                                    attrs: {
                                        name: item[this.nameField]
                                    }
                                },
                                [
                                    h(
                                        "template",
                                        {
                                            slot: "title"
                                        },
                                        getMenuContent(item)
                                    ),
                                    getItemTree(item.children)
                                ]
                            );
                        }
                    } else {
                        return h(
                            "MenuItem",
                            {
                                attrs: {
                                    name: item[this.nameField]
                                }
                            },
                            getMenuContent(item)
                        );
                    }
                });
            }
        };
        return h(
            "Menu",
            {
                attrs: {
                    mode: this.mode,
                    accordion: this.accordion,
                    fullscreen: this.fullscreen,
                    theme: this.theme,
                    width: this.width,
                    collapse: this.collapse,
                    activeName: this.activeName,
                    openNames: this.openNames
                },
                on: {
                    "on-select": this.onSelect,
                    "on-open-change": this.onOpenChange
                }
            },
            [
                getItemTree(this.realData),
                h("div", { slot: "header" }, this.$slots.header),
                h("div", { slot: "footer" }, this.$slots.footer)
            ]
        );
    },
    data: function() {
        return {};
    },
    computed: {
        realData() {
            let dataSource = this.dataSource;
            let val = [];
            if (dataSource.length) {
                if (this.mode == "horizontal" && this.fullscreen) {
                    val = Utils.toTreeSpecial(
                        dataSource,
                        this.nameField,
                        this.pnameField
                    );
                } else {
                    val = Utils.toTree(
                        dataSource,
                        this.nameField,
                        this.pnameField
                    );
                }
            }
            console.log("dataSource", val);
            return val;
        }
    },
    components: {
        Menu,
        MenuItem: Menu.Item,
        Submenu: Menu.Sub,
        MenuGroup: Menu.Group
    },
    methods: {
        onSelect(id) {
            let item = this.dataSource.filter(item => {
                return item.id == id;
            });
            this.$emit("on-select", item[0]);
        },
        onOpenChange(idArr) {
            let itemArr = this.dataSource.filter(item => {
                return idArr.some(id => {
                    return item.id == id;
                });
            });
            this.$emit("on-open-change", itemArr);
        }
    }
};
</script>
<style lang="less" src="./theme.less"></style>
