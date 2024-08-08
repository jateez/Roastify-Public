export default function Avatar({ imageUrl, fullName }) {
  console.log(fullName[0]);
  if (imageUrl) {
    return (
      <>
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img src={imageUrl} />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="avatar placeholder">
        <div className="bg-neutral text-neutral-content w-24 rounded-full">
          <span className="text-3xl text-spotify-white">{fullName[0]}</span>
        </div>
      </div>
    </>
  );
}
