import { useState, useRef, useEffect } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import WikiCard from "../ui/wikiCard";
import Icon from "../ui/icon";
import { cn } from "@/lib/utils";

const HANDLE_WIDTH = 60;

const WikiDrawer = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDragX, setStartDragX] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [wikiWidth, setWikiWidth] = useState(0);
  const [drawerWidth, setDrawerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const wikiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({ x: wikiWidth - HANDLE_WIDTH, y: 0 });
  }, [wikiWidth]);

  useEffect(() => {
    if (wikiContainerRef.current) {
      setWikiWidth(wikiContainerRef.current.offsetWidth);
    }
  }, [wikiContainerRef, wikiContainerRef.current?.parentElement?.offsetWidth]);

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
    setDrawerWidth(wikiWidth - newX);
    setIsDragging(false);
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
          setTimeout(() => setLastX(data.x), 25);
          setDrawerWidth(wikiWidth - data.x);
        }}
        onStart={(_, data) => {
          setStartDragX(data.x);
          setIsDragging(true);
        }}
        handle=".handle"
      >
        <div className="flex bg-muted pointer-events-auto h-full shadow-2xl">
          <div
            className={cn(
              "handle h-full p-1 bg-[#50648e] border-x border-[#17171f] text-slate-300 hover:text-slate-100 transition-colors duration-200 shadow-inner cursor-pointer",
              isDragging && "cursor-grabbing"
            )}
            style={{ width: HANDLE_WIDTH }}
          >
            <div className="relative h-full group flex flex-col items-center justify-center border-[#17171f] rounded-lg shadow-inner">
              <p
                className={cn(
                  "absolute bottom-16 -rotate-90 whitespace-nowrap font-semibold text-xl text-slate-400 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-500",
                  isDragging && "!opacity-0"
                )}
              >
                Drag or click
              </p>
              <div className="py-8 rounded bg-[#17171f35] group-hover:bg-[#17171f3e] transition-colors duration-200 shadow-inner">
                <Icon name={"GripVertical"} size={38} />
              </div>
            </div>
          </div>
          <div className="overflow-y-scroll">
            <div
              className="flex flex-wrap h-full p-4 pr-20 gap-4"
              style={{ width: drawerWidth }}
            >
              <h1 className="w-full text-3xl font-bold">Wiki</h1>
              <WikiCard
                title="title"
                description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
                width={"656"}
              />
              <WikiCard
                title="title"
                description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?  adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?  adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
                width="100%"
              />
              <WikiCard
                title="title"
                description="Lorem fficiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
              />
              <WikiCard
                title="title"
                description="sit amet consectetur adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
              />
              <WikiCard
                title="title"
                description=" Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
              />
              <WikiCard
                title="title"
                description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
              />
              <WikiCard
                title="title"
                description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
              />
              <WikiCard
                title="title"
                description="Lorem ipsum dolor, sit amet consec?"
              />
              <WikiCard
                title="title"
                description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
              />
              <WikiCard
                title="title"
                description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo aliquid fuga distinctio. Optio officiis corrupti impedit eos animi tenetur velit odio atque magnam! Nulla aliquid quae praesentium eaque aspernatur repellat doloremque velit, ab dignissimos cumque consectetur dolore optio consequatur temporibus, beatae officiis soluta a, debitis modi. Optio perspiciatis repudiandae odit?"
              />
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default WikiDrawer;
