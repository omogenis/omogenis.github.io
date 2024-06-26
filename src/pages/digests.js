import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function Header() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <main>
      <section>
        <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div class="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
              <img
                alt=""
                src="https://www.tripsavvy.com/thmb/fFThlJRsaRvtODj7uvpwMV2mNKA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/154103686-56a3b15d3df78cf7727e9fc3.jpg"
                class="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div class="lg:py-24">
              <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Новостной дайджест</h2>

              <p class="mt-4 text-gray-600">
              Получайте самые актуальные новости из Греции! Дайджест от сообщества ομογενής предоставляет свежую информацию о событиях в стране.
              </p>

              <a
                href="#latest"
                class="inline-block rounded-lg px-4 py-1.5 text-base ring-blue-700 hover:ring-blue-700 font-semibold leading-7 text-blue-700 ring-1 ring-blue-700 hover:ring-blue-700 hover:text-blue-700"
              >
                Последний выпуск
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Digests() {
  return (
<section class="bg-gray-50">
  <div class="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
    <div class="md:flex md:items-end md:justify-between">
      <div class="max-w-xl">
        <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Последние выпуски
        </h2>
        <a id="latest"></a>
        <p class="mt-6 max-w-lg leading-relaxed text-gray-700">
          Ознакомьтесь с последними выпусками нашего дайджеста, чтобы быть в курсе главных событий: новости политики, культуры, спорта и многого другого. Не упустите важные моменты из жизни Греции!
        </p>
      </div>

      <a
                    href="/digest"
                    className="inline-block rounded-lg px-4 py-1.5 text-base ring-blue-700 hover:ring-blue-700 font-semibold leading-7 text-blue-700 ring-1 ring-blue-700 hover:ring-blue-700 hover:text-blue-700"
                  >
                    Все выпуски
                    <span className="text-blue-600 " aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-2 md:grid-cols-2">

    <article class="flex bg-white transition hover:shadow-xl">
  <div class="rotate-180 p-2 [writing-mode:_vertical-lr]">
    <time
      datetime="2024-04-27"
      class="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
    >
      <span>2024</span>
      <span class="w-px flex-1 bg-gray-900/10"></span>
      <span>Απρίλιος</span>
    </time>
  </div>

  <div class="hidden sm:block sm:basis-56">
    <img
      alt=""
      src="https://www.tovima.gr/wp-content/uploads/2024/04/25/462A7015.jpg"
      class="aspect-square h-full w-full object-cover"
    />
  </div>

  <div class="flex flex-1 flex-col justify-between">
    <div class="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
      <a href="/digest/2024/04/28">
        <h3 class="font-bold uppercase text-gray-900">
        22/04/2024–28/04/2024
        </h3>
      </a>

      <p class="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
      Πολιτική. Υπουργείο Εσωτερικών: Το πόρισμα για τη διαρροή των στοιχείων Ελλήνων του εξωτερικού
      </p>
    </div>

    <div class="sm:flex sm:items-end sm:justify-end">
      <a
        href="/digest/2024/04/28/"
        class="block bg-blue-600 px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-blue-600 hover:text-white"
      >
        Подробнее
      </a>
    </div>
  </div>
</article>

    <article class="flex bg-white transition hover:shadow-xl">
  <div class="rotate-180 p-2 [writing-mode:_vertical-lr]">
    <time
      datetime="2024-04-21"
      class="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
    >
      <span>2024</span>
      <span class="w-px flex-1 bg-gray-900/10"></span>
      <span>Απρίλιος</span>
    </time>
  </div>

  <div class="hidden sm:block sm:basis-56">
    <img
      alt=""
      src="https://www.kathimerini.gr/wp-content/uploads/2024/04/a4-156.jpg?v=1713020745"
      class="aspect-square h-full w-full object-cover"
    />
  </div>

  <div class="flex flex-1 flex-col justify-between">
    <div class="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
      <a href="/digest/2024/04/17/">
        <h3 class="font-bold uppercase text-gray-900">
        15/04/2024-21/04/2024
        </h3>
      </a>

      <p class="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
      Πολιτική.
      Άρθρο του Κυριάκου Μητσοτάκη στην «Κ»: Η προστασία του περιβάλλοντος είναι και γαλάζια
      </p>
    </div>

    <div class="sm:flex sm:items-end sm:justify-end">
      <a
        href="/digest/2024/04/17/"
        class="block bg-blue-600 px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-blue-600 hover:text-white"
      >
        Подробнее
      </a>
    </div>
  </div>
</article>

    </div>
  </div>
</section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Новостной дайджест`}
      description="Греки-соотечественники в постсоветских странах - это сайт, посвященный греческому гражданству и культуре для греков-соотечественников из стран бывшего Советского союза. На сайте вы найдете полезную информацию о процедуре натурализации, подготовке документов, изучении греческого языка и истории, а также контакты адвокатов и переводчиков. Присоединяйтесь к нашему сообществу и узнайте больше о греческом наследии."
    >
      <Header />
      <Digests />
      <main>{/* <HomepageFeatures /> */}</main>
    </Layout>
  );
}
