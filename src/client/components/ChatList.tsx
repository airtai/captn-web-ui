import { Link } from "@wasp/router";
import type { Chat } from "@wasp/entities";

export default function ChatsList(chats: Chat[]) {
  return (
    <div>
      {
        // Todo: remove the below ignore comment
        // @ts-ignore
        chats.chats.map((chat, idx) => (
          <Link key={chat.id} to="/chat/:id?" params={{ id: chat.id }}>
            <li key={idx}>
              <div className="flex items-center p-2 text-white hover:bg-captn-light-blue hover:text-captn-dark-blue group rounded-lg ">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon-sm"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="ml-3">{chat.id}</span>
              </div>
            </li>
          </Link>
        ))
      }
    </div>
  );
}
