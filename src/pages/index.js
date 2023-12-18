import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function Header() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <main>
      <section className="bg-gradient-to-tr from-blue-500 via-blue-700 to-blue-900">
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
            <div>
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-white">
                  <span className="text-white">
                  Ανοίξτε την ιστοσελίδα στα ελληνικά {" "}
                    <a
                      href="/el"
                      className="font-semibold text-white hover:text-white"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      Έλα! <span aria-hidden="true">&rarr;</span>
                    </a>
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl text-white">
                  Греки-соотечественники в постсоветских странах
                </h1>
                <p className="mt-6 text-2xl leading-8 text-gray-200 sm:text-center">
                  Ομογενείς στην πρώην Σοβιετική Ένωση
                </p>
                <div className="mt-8 flex gap-x-4 sm:justify-center">
                  <a
                    href="/petition"
                    className="inline-block rounded-lg px-4 py-1.5 text-base ring-white hover:ring-white font-semibold leading-7 text-gray-100 ring-1 ring-white hover:ring-white hover:text-white"
                  >
                    Петиция
                    <span className="text-blue-200 " aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                  <a
                    href="/statistics"
                    className="inline-block rounded-lg px-4 py-1.5 text-base ring-white hover:ring-white font-semibold leading-7 text-gray-100 ring-1 ring-white hover:ring-white hover:text-white"
                  >
                    Статистика
                    <span className="text-gray-100" aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Materials() {
  return (
    <section class="bg-gray-900">
      <div class="container px-6 py-10 mx-auto">
        <h1 class="text-3xl font-semibold lg:text-4xl text-white">
          Ознакомьтесь с нашими{" "}
          <span class="underline decoration-blue-500">материалами</span>
        </h1>

        <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
          <div class="p-8 space-y-3 border-2 border-blue-300 rounded-xl">
            <span class="inline-block text-blue-500 dark:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
            </span>

            <h1 class="text-2xl font-semibold text-white">Петиция</h1>

            <p class="text-gray-300">
              Петиция к Правительству Греции об упрощении процедуры
              натурализации.
            </p>

            <a
              href="/petition"
              class="inline-flex p-2 text-blue-500 capitalize transition-colors duration-300 transform bg-blue-100 rounded-full rtl:-scale-x-100 dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </a>
          </div>

          <div class="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl tw-border-solid">
            <span class="inline-block text-blue-500 dark:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </span>

            <h1 class="text-2xl font-semibold text-white">Статистика</h1>

            <p class="text-gray-300">
              Статистика по ходатайствам о гражданстве Греции от греков стран
              бывшего Советского союза.
            </p>

            <a
              href="/statistics"
              class="inline-flex p-2 text-blue-500 capitalize transition-colors duration-300 transform bg-blue-100 rounded-full rtl:-scale-x-100 dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </a>
          </div>

          <div class="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl">
            <span class="inline-block text-blue-500 dark:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </span>

            <h1 class="text-2xl font-semibold text-white">
              Материалы и инструкции
            </h1>

            <p class="text-gray-300">
              Инструкции по подготовке пакета документов, контакты переводчиков,
              ресурсы по изучению Греческого языка и истории эллинизма.
            </p>

            <a
              href="/docs/intro"
              class="inline-flex p-2 text-blue-500 capitalize transition-colors duration-300 transform bg-blue-100 rounded-full rtl:-scale-x-100 dark:bg-blue-500 dark:text-white hover:underline hover:text-blue-600 dark:hover:text-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Этнические греки из стран бывшего СССР`}
      description="Изучение греческого языка, получение гражданства и полезные советы"
    >
      <Header />
      <Materials />
      <main>{/* <HomepageFeatures /> */}</main>
    </Layout>
  );
}
