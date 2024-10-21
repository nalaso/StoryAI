import React, { forwardRef, Ref } from "react";
import HTMLFlipBook from "react-pageflip";

interface PageProps {
    number: number;
    content: string;
    image: string;
    title: string;
}

interface Page {
    title: string;
    content: string;
    image: string;
}

interface Story {
    title: string;
    image: string;
    pages: Page[];
}

const Page = forwardRef<HTMLDivElement, PageProps>(({content,number,image,title}, ref: Ref<HTMLDivElement>) => {
    return (
        <div className="page p-5 bg-[hsl(35,55%,98%)] text-[hsl(35,35%,35%)] border border-[hsl(35,20%,70%)] overflow-hidden" ref={ref} data-density="hard">
            <div className="page-content flex flex-col justify-between items-stretch w-full h-full">
                {/* <h2 className="page-header text-center uppercase h-[30px] text-base">{title}</h2> */}
                <div className="page-image bg-center bg-no-repeat bg-contain h-full" style={{ backgroundImage: `url(${image})` }}></div>
                <div className="page-text flex-grow h-full text-justify text-medium mt-2 pt-2 box-border border-t border-[hsl(35,55%,90%)]">{content}</div>
                <div className="page-footer h-[30px] border-t border-[hsl(35,55%,90%)] text-[hsl(35,20%,50%)] text-sm">{number}</div>
            </div>
        </div>
    );
});

Page.displayName = "Page"

function StoryBook({story}: {story: Story}) {
    return (
        <HTMLFlipBook
            width={500}
            height={700}
            size="fixed"
            minWidth={300}
            swipeDistance={0}
            showPageCorners={true}
            disableFlipByClick={false}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={1}
            clickEventForward={true}
            maxWidth={1000}
            minHeight={500}
            maxHeight={1533}
            drawShadow={false}
            flippingTime={1000}
            usePortrait={true}
            startPage={0}
            useMouseEvents={true}
            showCover={true}
            mobileScrollSupport={false}
            className="demo-book shadow-lg hidden bg-cover"
            style={{ background: "#fff" }}
        >
            <div className="bg-[hsl(35,45%,80%)] text-[hsl(35,35%,35%)] border border-[hsl(35,20%,50%)]" data-density="hard">
                <div style={{height: "inherit"}} className="page-content overflow-hidden">
                    <img src={story?.image} alt={story?.title} className="w-full object-contain" />
                </div>
            </div>
            {
                story.pages.length > 0 && story.pages.map((page, index) => (
                    <Page number={index + 1} key={index} content={page.content} image={page.image} title={page.title} />
                ))
            }
            <div className="page page-cover page-cover-bottom bg-[hsl(35,45%,80%)] text-[hsl(35,35%,35%)] border border-[hsl(35,20%,50%)]" data-density="hard">
                <div className="page-content text-center">
                    <h2 className="pt-[50%] text-[210%]">THE END</h2>
                </div>
            </div>
        </HTMLFlipBook>
    );
}

export default StoryBook;
