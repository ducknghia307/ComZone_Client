import { Comic } from "../../common/base.interface";

export default function SingleOfferedComics({
  comics,
  index,
  currentlySelected,
  handleSelect,
  length,
}: {
  comics: Comic;
  index: number;
  currentlySelected: number;
  handleSelect: (value: number) => void;
  length: number;
}) {
  if (length < 10)
    return (
      <div
        key={index}
        className={`basis-full flex justify-between border border-gray-300 rounded-lg p-1 transition-all duration-300`}
      >
        <div className="basis-full xl:basis-2/3 flex items-center justify-start gap-4">
          <img
            src={comics.coverImage}
            alt=""
            className={`w-[6em] h-auto rounded-lg transition-all duration-300`}
          />
          <div className={`flex flex-col items-start gap-2`}>
            <div className="flex flex-col items-start">
              <p className="font-bold text-start">{comics.title}</p>
              <p className="font-light text-xs">{comics.author}</p>
            </div>
            <div
              className={`flex flex-col items-start text-[0.8rem] font-light transition-all duration-200`}
            >
              <p>
                <span className="font-extralight">Phiên bản:</span>{" "}
                {comics.edition.name}
              </p>
              <p>
                <span className="font-extralight">Tình trạng:</span>{" "}
                {comics.condition.name}
              </p>
            </div>
          </div>
        </div>

        {comics.previewChapter && (
          <div className="hidden xl:grid grid-cols-2 gap-x-1 gap-y-1 basis-1/3">
            {comics.previewChapter.map((src, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    comics.previewChapter.length % 2 !== 0 &&
                    index === comics.previewChapter.length - 1 &&
                    "col-span-2"
                  } min-w-12 min-h-16 bg-no-repeat bg-cover bg-center rounded-sm`}
                  style={{ backgroundImage: `url(${src})` }}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  else
    return (
      <button
        key={index}
        className={`${
          currentlySelected === index
            ? "basis-full bg-black text-white"
            : "basis-[49%] hover:bg-gray-100 hover:duration-200"
        } flex justify-between border border-gray-300 rounded-lg p-1 transition-all duration-300`}
        onClick={() => handleSelect(index)}
      >
        <div className="flex items-center justify-start gap-4">
          <img
            src={comics.coverImage}
            alt=""
            className={`${
              currentlySelected === index ? "w-[6em]" : "w-[3em]"
            }  h-auto rounded-lg transition-all duration-300`}
          />
          <div
            className={`flex flex-col items-start gap-2 ${
              currentlySelected === index && "text-[150%]"
            }`}
          >
            <div className="flex flex-col items-start">
              <p className="font-bold text-start">{comics.title}</p>
              <p className="font-light text-xs">{comics.author}</p>
            </div>
            <div
              className={`${
                currentlySelected === index ? "" : "hidden"
              } flex flex-col items-start text-[0.8rem] font-light transition-all duration-200`}
            >
              <p>
                <span className="font-extralight">Phiên bản:</span>{" "}
                {comics.edition.name}
              </p>
              <p>
                <span className="font-extralight">Tình trạng:</span>{" "}
                {comics.condition.name}
              </p>
            </div>
          </div>
        </div>

        {comics.previewChapter && currentlySelected === index && (
          <div className="grid grid-cols-2 gap-x-1 gap-y-1 bg-black">
            {comics.previewChapter.map((src, index) => {
              return (
                <div
                  key={index}
                  className={`w-16 h-16 bg-no-repeat bg-cover bg-center rounded-sm`}
                  style={{ backgroundImage: `url(${src})` }}
                />
              );
            })}
          </div>
        )}
      </button>
    );
}
