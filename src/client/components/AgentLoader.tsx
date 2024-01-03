export default function AgentLoader({ logo }: { logo: string }) {
  return (
    <div
      data-testid="agent-loader"
      className={`flex items-center px-5 py-2 group  flex-col animate-pulse bg-captn-light-cream`}
      style={{ minHeight: "85px" }}
    >
      <div
        className="relative ml-3 block w-full p-4 pl-10 text-sm text-captn-dark-blue  border-captn-light-cream rounded-lg bg-captn-light-cream "
        style={{ maxWidth: "840px", margin: "auto" }}
      >
        <span
          className="absolute inline-block"
          style={{
            left: "-15px",
            top: "6px",
            height: " 45px",
            width: "45px",
          }}
        >
          <img
            alt="captn logo"
            src={logo}
            className="w-full h-full"
            style={{ borderRadius: "50%" }}
          />
        </span>
        <div className="chat-conversations text-base flex flex-col gap-2">
          <span>
            I am presently navigating the waters of your request.
            <br />
            Kindly stay anchored, and I will promptly return to you once I have
            information to share.
          </span>
        </div>
      </div>
    </div>
  );
}
