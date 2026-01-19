import {Link} from "react-router-dom";

export default function NotFoundPage() {

  return (
    <main className="text-[20px] h-[100vh] overflow-auto bg-[url(/images/bg2.jpg)] bg-cover bg-center flex">
      <div className="grow overflow-auto p-[40px] backdrop-invert-100">
        <p>Not found, <Link to="/" className="text-blue-700 underline">на главную</Link></p>
      </div>
    </main>
  );
}
