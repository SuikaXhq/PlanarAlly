import Vue from "vue";

import Component from "vue-class-component";

import ContextMenu from "@/core/components/contextmenu.vue";

import { AssetManager } from "@/assetManager/assets";
import { socket } from "@/assetManager/socket";
import { getComponent } from "@/core/utils";

const vm = getComponent<AssetManager>();

@Component({
    components: {
        ContextMenu,
    },
    template: `
        <contextmenu :visible="visible" :left="left + 'px'" :top="top + 'px'" @close="close">
            <li @click="rename">Rename</li>
            <li @click="remove">Remove</li>
        </contextmenu>
    `,
})
export class AssetContextMenu extends Vue {
    visible = false;
    left = 0;
    top = 0;
    open(event: MouseEvent, inode: number) {
        if (!vm.selected.includes(inode)) vm.select(event, inode);

        this.visible = true;
        this.left = event.pageX;
        this.top = event.pageY;
        this.$nextTick(() => {
            this.$children[0].$el.focus();
        });
    }
    close() {
        this.visible = false;
    }
    rename() {
        if (vm.selected.length !== 1) return;
        const asset = vm.idMap.get(vm.selected[0])!;

        (<any>vm.$refs.prompt).prompt("New name:", `Renaming ${asset.name}`).then(
            (name: string) => {
                socket.emit("Asset.Rename", {
                    asset: asset.id,
                    name,
                });
                asset.name = name;
                vm.$forceUpdate();
            },
            () => {},
        );
        this.close();
    }
    remove() {
        if (vm.selected.length === 0) return;
        (<any>vm.$refs.confirm).open("Are you sure you wish to remove this?").then(
            (result: boolean) => {
                if (result) {
                    for (const sel of vm.selected) {
                        socket.emit("Asset.Remove", sel);
                        if (vm.isFile(sel)) vm.files.splice(vm.files.indexOf(sel), 1);
                        else vm.folders.splice(vm.folders.indexOf(sel), 1);
                    }
                    vm.selected = [];
                }
            },
            () => {},
        );
        this.close();
    }
}
