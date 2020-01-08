import { Repeater, Link } from 'cx/widgets';
import { createFunctionalComponent, computable } from 'cx/ui';
import { ref } from 'cx/hooks';

function log(x) {
    console.log(x);
    return x;
}

export const NavTree = createFunctionalComponent(({ tree, url, showCategory }) => {
    let treeRef = ref(tree);
    let urlRef = ref(url);

    let visibleNode = computable(treeRef, urlRef, (tree, url) => {
        let node = tree.find(item => item.url && url.startsWith(item.url));
        return node || { children: [] };
    });

    return (
        <cx>
            <div class="sidenav_category" visible={() => showCategory && !!visibleNode().text}>
                <Link href={() => visibleNode().href} text={() => visibleNode().text} url="dummy" />
            </div>
            <Repeater records={() => visibleNode().children} recordAlias="$group">
                <div text-bind="$group.text" class="sidenav_group" />
                <Repeater records-bind="$group.children" recordAlias="$item">
                    <Link href-bind="$item.url" url={url} text-bind="$item.text" />
                </Repeater>
            </Repeater>
        </cx>
    );
});
