``// project single to be made grid like inethos home 
<article className="flex bg-white transition hover:shadow-xl">
  <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
    <time
      datetime="2022-10-10"
      className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
    >
      <span>2022</span>
      <span className="w-px flex-1 bg-gray-900/10"></span>
      <span>Oct 10</span>
    </time>
  </div>

  <div className="hidden sm:block sm:basis-56">
    <img
      alt=""
      src="https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
      className="aspect-square h-full w-full object-cover"
    />
  </div>

  <div className="flex flex-1 flex-col justify-between">
    <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
      <a href="#">
        <h3 className="font-bold uppercase text-gray-900">
          Finding the right guitar for your style - 5 tips
        </h3>
      </a>

      <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
        pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis
        quidem, mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius
        atque dignissimos. Molestias explicabo corporis voluptatem?
      </p>
    </div>

    <div className="sm:flex sm:items-end sm:justify-end">
      <a
        href="#"
        className="block bg-yellow-300 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
      >
        Read Blog
      </a>
    </div>
  </div>
</article>


// products cards to be replaced with each project which is the above 
<section>
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <header>
      <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Product Collection</h2>

      <p className="mt-4 max-w-md text-gray-500">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque praesentium cumque iure
        dicta incidunt est ipsam, officia dolor fugit natus?
      </p>
    </header>

    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <li>
        <a href="#" className="group block overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt=""
            className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
          />

          <div className="relative bg-white pt-3">
            <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
              Basic Tee
            </h3>

            <p className="mt-2">
              <span className="sr-only"> Regular Price </span>

              <span className="tracking-wider text-gray-900"> £24.00 GBP </span>
            </p>
          </div>
        </a>
      </li>

      <li>
        <a href="#" className="group block overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt=""
            className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
          />

          <div className="relative bg-white pt-3">
            <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
              Basic Tee
            </h3>

            <p className="mt-2">
              <span className="sr-only"> Regular Price </span>

              <span className="tracking-wider text-gray-900"> £24.00 GBP </span>
            </p>
          </div>
        </a>
      </li>

      <li>
        <a href="#" className="group block overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt=""
            className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
          />

          <div className="relative bg-white pt-3">
            <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
              Basic Tee
            </h3>

            <p className="mt-2">
              <span className="sr-only"> Regular Price </span>

              <span className="tracking-wider text-gray-900"> £24.00 GBP </span>
            </p>
          </div>
        </a>
      </li>

      <li>
        <a href="#" className="group block overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt=""
            className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
          />

          <div className="relative bg-white pt-3">
            <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
              Basic Tee
            </h3>

            <p className="mt-2">
              <span className="sr-only"> Regular Price </span>

              <span className="tracking-wider text-gray-900"> £24.00 GBP </span>
            </p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</section>


// stats section sample to be used as my goal section with loop of my wise quotes above 


// badges to be used as tech stack and tools or roles also under a project 
{/* Success - Solid */}

<span
  className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="-ms-1 me-1.5 size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>

  <p className="whitespace-nowrap text-sm">Paid</p>
</span>

{/* Success - Outlined */}

<span
  className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-2.5 py-0.5 text-emerald-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="-ms-1 me-1.5 size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>

  <p className="whitespace-nowrap text-sm">Paid</p>
</span>

{/* Warning - Solid */}

<span
  className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="-ms-1 me-1.5 size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L10.5 7.5M8.25 9.75L10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"
    />
  </svg>

  <p className="whitespace-nowrap text-sm">Refunded</p>
</span>

{/* Warning - Outlined  */}

<span
  className="inline-flex items-center justify-center rounded-full border border-amber-500 px-2.5 py-0.5 text-amber-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="-ms-1 me-1.5 size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L10.5 7.5M8.25 9.75L10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"
    />
  </svg>

  <p className="whitespace-nowrap text-sm">Refunded</p>
</span>

{/* Error- Solid */}

<span
  className="inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-0.5 text-red-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="-ms-1 me-1.5 size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>

  <p className="whitespace-nowrap text-sm">Failed</p>
</span>

{/* Error - Outlined */}

<span
  className="inline-flex items-center justify-center rounded-full border border-red-500 px-2.5 py-0.5 text-red-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="-ms-1 me-1.5 size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>

  <p className="whitespace-nowrap text-sm">Failed</p>
</span>

// ``


// 