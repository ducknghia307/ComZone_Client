export default function SingleOfferedComics({
  comics,
  index,
  currentlySelected,
  handleSelect,
}: {
  comics: { name: string; image: string; preview?: string[] };
  index: number;
  currentlySelected: number;
  handleSelect: (value: number) => void;
}) {
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
          src={comics.image}
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
            <p className="font-bold text-start">{comics.name}</p>
            <p className="font-light text-xs">Marvel</p>
          </div>
          <div
            className={`${
              currentlySelected === index ? "" : "hidden"
            } text-[0.8rem] font-light transition-all duration-200`}
          >
            <p>
              <span className="font-extralight">Phiên bản:</span> Bản giới hạn
            </p>
            <p>
              <span className="font-extralight">Tình trạng:</span> Nguyên seal
            </p>
          </div>
        </div>
      </div>

      {comics.preview && currentlySelected === index && (
        <div className="grid grid-cols-2 gap-x-1 gap-y-1 bg-black">
          {comics.preview.map((src, index) => {
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
