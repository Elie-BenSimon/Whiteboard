import { useState, useRef, useEffect } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

const HANDLE_WIDTH = 60;

const WikiDrawer = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDragX, setStartDragX] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [wikiWidth, setWikiWidth] = useState(0);
  const wikiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({ x: wikiWidth - HANDLE_WIDTH, y: 0 });
  }, [wikiWidth]);

  useEffect(() => {
    if (wikiContainerRef.current) {
      setWikiWidth(wikiContainerRef.current.offsetWidth);
    }
  }, [wikiContainerRef]);

  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    const deltaX = data.x - startDragX;
    let newX;
    if (deltaX === 0) {
      newX =
        position.x !== wikiWidth - HANDLE_WIDTH ? wikiWidth - HANDLE_WIDTH : 0;
    } else {
      const lastDeltaX = Math.abs(lastX - data.x);
      newX =
        lastDeltaX < 5 ? data.x : data.x > lastX ? wikiWidth - HANDLE_WIDTH : 0;
    }
    setPosition({ x: newX, y: 0 });
  };

  return (
    <div
      ref={wikiContainerRef}
      className="absolute right-0 z-10 w-4/5 h-full pointer-events-none"
    >
      <Draggable
        axis="x"
        bounds={{ left: 0, right: wikiWidth - HANDLE_WIDTH }}
        position={position}
        onStop={handleDragStop}
        onDrag={(_, data) => {
          setTimeout(() => setLastX(data.x), 40);
        }}
        onStart={(_, data) => setStartDragX(data.x)}
        handle=".handle"
      >
        <div className="bg-card border-l pointer-events-auto h-full shadow-2xl">
          <div
            className="absolute left-0 top-0 handle h-full bg-red-500"
            style={{ width: HANDLE_WIDTH }}
          >
            handle
          </div>
          <div className="h-full overflow-y-scroll p-16 pl-24">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates
            quibusdam eaque sapiente assumenda pariatur suscipit enim sunt id,
            laboriosam, fuga architecto, ipsum numquam ad. Impedit maxime hic
            optio consequatur eligendi fuga est, in aspernatur harum quaerat
            maiores autem ad consequuntur eius nesciunt doloribus quod tenetur
            perferendis nam fugit dicta id voluptas. Vel voluptatibus nulla
            nostrum nobis laboriosam sit ut id doloribus sint eligendi. Pariatur
            dolor mollitia beatae illum expedita necessitatibus debitis nesciunt
            blanditiis doloremque vel aspernatur eos vitae nobis voluptatum
            tempore laborum suscipit repudiandae eveniet deserunt, odit nemo!
            Quaerat, accusamus explicabo repellat expedita impedit quibusdam
            animi reiciendis illum quis distinctio, neque, modi incidunt
            consequatur. Recusandae eveniet inventore numquam debitis fuga saepe
            earum facere impedit exercitationem voluptatem ipsa voluptatum
            ipsum, velit, ea doloremque distinctio. Ex at animi quaerat
            repudiandae numquam earum odio sequi nisi, perferendis ea dolorem
            ducimus saepe veritatis eaque ipsum necessitatibus sed dignissimos
            molestias dicta explicabo illo, autem magni quos! Sed, sunt! Vitae
            unde molestias natus dolor placeat deleniti consequatur quisquam
            autem expedita rerum quaerat voluptate sunt atque doloremque quos
            quo delectus earum, officia sed, nesciunt adipisci commodi? Nulla
            cum unde, perferendis eos accusantium provident laudantium sed
            veniam doloribus tempore assumenda neque rerum illo nisi ex tenetur
            iusto aut quos laborum eveniet! Quia veritatis esse nesciunt cumque
            soluta assumenda tenetur repellendus voluptatibus, nulla amet rerum
            eos odio veniam? Quis quas impedit sapiente laborum possimus alias
            molestias, aut aperiam consequatur enim quam soluta deserunt vel
            doloribus aspernatur? Aut soluta nihil dolor beatae iusto. Expedita,
            asperiores? Libero vero sapiente quia corporis dolorum non iure
            delectus molestiae ratione! Quod dolore porro doloremque,
            consequuntur sint totam aliquid iure quisquam, minima nesciunt ipsa
            aperiam quasi incidunt? Deleniti nihil inventore quisquam quas
            itaque, asperiores delectus ipsum, explicabo voluptate earum nam
            suscipit sunt minima. Saepe rerum dolore omnis repellat architecto
            neque quaerat eius voluptates repellendus doloremque atque inventore
            quo nemo exercitationem maiores similique, sunt modi aut,
            repudiandae, eligendi dolor voluptas odio voluptatum! Illo, soluta
            in repudiandae tempore esse assumenda aut qui officiis? Dolorum,
            voluptates! Accusamus rerum aperiam perferendis repellendus odit nam
            doloremque. Nesciunt doloribus aut rem harum nobis repellendus
            voluptates unde sapiente voluptatibus tempora laborum, commodi
            architecto tenetur blanditiis nulla maxime officia aspernatur
            laboriosam quidem corrupti temporibus veritatis! Nisi reiciendis
            maiores laboriosam est fugit commodi rem officiis itaque suscipit
            iusto facere nam magnam quam quibusdam iure, molestias veritatis,
            unde sed cumque quia eaque dolor molestiae! Architecto consequatur
            eius delectus porro itaque cupiditate ipsum quo consequuntur sunt
            labore blanditiis, laborum voluptatem facere tempora minus dolore
            unde perferendis quod necessitatibus ipsa velit? Quasi dolorem qui
            natus, cupiditate architecto sequi sed expedita vel velit, eligendi
            quae nulla! Cupiditate dolores totam tempora deleniti quisquam,
            iusto perspiciatis repellat sint ea! Voluptatibus dicta consectetur
            suscipit maxime, alias delectus placeat laborum, cumque nostrum
            provident totam dolores numquam! Sint nostrum, molestiae dolores
            quisquam veritatis libero, unde dignissimos temporibus provident
            odio reprehenderit accusamus quas! Error nesciunt unde earum sunt
            libero pariatur cumque! Quos repellendus ipsa voluptates quae
            repudiandae temporibus minima? Dignissimos fugiat impedit delectus
            sint. Odio et voluptates hic minus dolores, aliquam id delectus
            tempore! Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Eum facilis similique animi quis, cum optio deserunt ipsam incidunt
            dolorem, harum expedita aut error accusamus aperiam. Ipsa,
            voluptatum nemo dolorum fugit aliquid commodi ipsum excepturi saepe
            rerum nostrum, ad deleniti in ratione nulla, quia obcaecati aut?
            Omnis accusantium assumenda nisi voluptatibus nam. Beatae officia
            sequi fuga cupiditate sed, ratione iure delectus velit! Inventore
            ducimus beatae nihil quisquam rem aliquam, ipsam, cum impedit optio
            exercitationem sit nam aperiam cumque accusamus iste, cupiditate
            perferendis maiores itaque sunt eum facilis nobis? Possimus vel aut,
            officia accusamus dolores, voluptatum iste dolorum delectus eaque,
            odit voluptatem!
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default WikiDrawer;
