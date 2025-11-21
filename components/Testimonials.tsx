import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="mt-10 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
          What Our Customers Say
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-4">
          Join thousands of happy customers who shop with confidence.
        </p>

        <div className="flex flex-wrap justify-center gap-5 mt-16 text-left">
          <div className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-white">
            <svg
              width="44"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
                fill="#2563EB"
              />
            </svg>

            <div className="flex items-center justify-center mt-3 gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
                    fill="#FF532E"
                  />
                </svg>
              ))}
            </div>

            <p className="text-sm mt-3 text-gray-500">
              I’ve been shopping here for months and the whole experience is
              super smooth – from browsing to checkout and delivery.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <Image
                className="h-12 w-12 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100"
                alt="Customer 1"
                width={48}
                height={48}
              />
              <div>
                <h3 className="text-lg text-gray-900 font-medium">
                  Donald Jackman
                </h3>
                <p className="text-sm text-gray-500">Repeat customer</p>
              </div>
            </div>
          </div>

          <div className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-white">
            <svg
              width="44"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
                fill="#2563EB"
              />
            </svg>

            <div className="flex items-center justify-center mt-3 gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
                    fill="#FF532E"
                  />
                </svg>
              ))}
            </div>

            <p className="text-sm mt-3 text-gray-500">
              Product quality is great and delivery is always on time. The order
              tracking and updates are really helpful.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <Image
                className="h-12 w-12 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"
                alt="Customer 2"
                width={48}
                height={48}
              />
              <div>
                <h3 className="text-lg text-gray-900 font-medium">
                  Richard Nelson
                </h3>
                <p className="text-sm text-gray-500">Verified buyer</p>
              </div>
            </div>
          </div>

          <div className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-white">
            <svg
              width="44"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
                fill="#2563EB"
              />
            </svg>

            <div className="flex items-center justify-center mt-3 gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
                    fill="#FF532E"
                  />
                </svg>
              ))}
            </div>

            <p className="text-sm mt-3 text-gray-500">
              The site is easy to use, filters are helpful and the checkout
              feels very secure. I like tracking my past orders in one place.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <Image
                className="h-12 w-12 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop"
                alt="Customer 3"
                width={48}
                height={48}
              />
              <div>
                <h3 className="text-lg text-gray-900 font-medium">
                  James Washington
                </h3>
                <p className="text-sm text-gray-500">Loyal customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
