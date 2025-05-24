import { env } from "..//env";

function Page() {
  const message = env.DEBUG_MESSAGE;

  return (
    <main>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Novel Smith</h1>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </main>
  );
}

export default Page;
