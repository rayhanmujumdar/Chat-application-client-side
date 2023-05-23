import ModalForm from "./form/ModalForm";

export default function Modal({ open, control }) {
  return (
    open && (
      <>
        <div
          onClick={() => control(false)}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <ModalForm control={control}></ModalForm>
        </div>
      </>
    )
  );
}
