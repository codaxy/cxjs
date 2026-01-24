import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { DragHandle, DragSource, DropZone, Repeater } from "cx/widgets";

// @model
interface Item {
  id: string;
  text: string;
}

interface Card {
  id: number;
  name: string;
  items: Item[];
}

interface BoardModel {
  cards: Card[];
  $card: Card;
  $cardIndex: number;
  $item: Item;
  $itemIndex: number;
}

const m = createModel<BoardModel>();
// @model-end

function moveElement<T>(array: T[], from: number, to: number): T[] {
  let result = [...array];
  let el = result.splice(from, 1)[0];
  if (from < to) to--;
  result.splice(to, 0, el);
  return result;
}

function insertElement<T>(array: T[], index: number, el: T): T[] {
  let result = [...array];
  result.splice(index, 0, el);
  return result;
}

// @controller
class BoardController extends Controller {
  onInit() {
    this.store.set(m.cards, [
      {
        id: 1,
        name: "TODO",
        items: [
          { id: "1:1", text: "Explore the Gallery" },
          { id: "1:2", text: "Read about Controllers" },
          { id: "1:3", text: "Try Drag & Drop" },
          { id: "1:4", text: "Build a Dashboard" },
          { id: "1:5", text: "Add Charts" },
        ],
      },
      {
        id: 2,
        name: "In Progress",
        items: [
          { id: "2:1", text: "Learn Data Binding" },
          { id: "2:2", text: "Build a Form" },
          { id: "2:3", text: "Form Validation" },
          { id: "2:4", text: "Grid Component" },
        ],
      },
      {
        id: 3,
        name: "Review",
        items: [
          { id: "3:1", text: "Typed Models" },
          { id: "3:2", text: "Routing Setup" },
          { id: "3:3", text: "State Management" },
        ],
      },
      {
        id: 4,
        name: "Done",
        items: [
          { id: "4:1", text: "Install CxJS" },
          { id: "4:2", text: "Hello World" },
          { id: "4:3", text: "Project Setup" },
          { id: "4:4", text: "TypeScript Config" },
        ],
      },
    ]);
  }
}
// @controller-end

// @index
export default (
  <section
    controller={BoardController}
    class="p-2.5 bg-[rgb(0,121,191)] min-h-[450px] rounded-lg"
  >
    <div class="flex flex-row items-start flex-wrap justify-center">
      <DropZone
        mod="inline-block"
        onDropTest={(e) => e.source.data.type == "card"}
        onDrop={(e, { store }) => {
          store.update(m.cards, moveElement, e.source.data.index, 0);
        }}
        matchWidth
        matchHeight
        matchMargin
        inflate={200}
      />
      <Repeater
        records={m.cards}
        recordAlias={m.$card}
        indexAlias={m.$cardIndex}
        keyField="id"
      >
        <DragSource
          class="w-[250px] m-2.5 p-2.5 bg-[#e2e4e6] rounded shadow-sm"
          data={{ index: m.$cardIndex, type: "card" }}
          hideOnDrag
          handled
          cloneStyle={{ transform: "rotate(3deg)", opacity: 0.9 }}
        >
          <DragHandle class="cursor-move px-1">
            <h4 class="m-0 mb-1.5 font-medium" ws>
              <span class="opacity-50">⋮⋮</span> <span text={m.$card.name} />
            </h4>
          </DragHandle>
          <DropZone
            mod="block"
            class="block"
            onDropTest={(e) => e.source.data.type == "item"}
            onDrop={(e, { store }) => {
              if (e.source.data.cardIndex == store.get(m.$cardIndex))
                store.update(
                  m.$card.items,
                  moveElement,
                  e.source.data.index,
                  0
                );
              else {
                let el = e.source.store.get(m.$item);
                e.source.store.update(m.$card.items, (items) =>
                  items.filter((item) => item != el)
                );
                store.update(m.$card.items, insertElement, 0, el);
              }
            }}
            matchHeight
            matchMargin
            inflate={30}
          />
          <Repeater
            records={m.$card.items}
            recordAlias={m.$item}
            indexAlias={m.$itemIndex}
            keyField="id"
          >
            <DragSource
              class="bg-white rounded block py-2 px-3 mt-1.5 shadow-sm cursor-pointer hover:bg-gray-50"
              data={{
                index: m.$itemIndex,
                cardIndex: m.$cardIndex,
                type: "item",
              }}
              hideOnDrag
              cloneStyle={{ transform: "rotate(2deg)", opacity: 0.9 }}
            >
              <div text={m.$item.text} />
            </DragSource>
            <DropZone
              mod="block"
              class="block"
              onDropTest={(e) => e.source.data.type == "item"}
              onDrop={(e, { store }) => {
                if (e.source.data.cardIndex == store.get(m.$cardIndex))
                  store.update(
                    m.$card.items,
                    moveElement,
                    e.source.data.index,
                    store.get(m.$itemIndex) + 1
                  );
                else {
                  let el = e.source.store.get(m.$item);
                  e.source.store.update(m.$card.items, (items) =>
                    items.filter((item) => item != el)
                  );
                  store.update(
                    m.$card.items,
                    insertElement,
                    store.get(m.$itemIndex) + 1,
                    el
                  );
                }
              }}
              nearDistance={false}
              matchHeight
              matchMargin
              inflate={30}
            />
          </Repeater>
        </DragSource>
        <DropZone
          mod="inline-block"
          onDropTest={(e) => e.source.data.type == "card"}
          onDrop={(e, { store }) => {
            store.update(
              m.cards,
              moveElement,
              e.source.data.index,
              store.get(m.$cardIndex) + 1
            );
          }}
          matchWidth
          matchHeight
          matchMargin
          inflate={200}
        />
      </Repeater>
    </div>
  </section>
);
// @index-end
