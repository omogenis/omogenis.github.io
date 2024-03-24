import React from "react";


function Contacts() {
  return (
	<div className="pt-2 border-t dark:border-gray-700" bis_skin_checked="1">
		<div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row" bis_skin_checked="1">
			<img src="/img/authors/Ivan-Dzhukha.jpg" alt="" className="self-center flex-shrink-0 w-48 h-48 border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-700" />
			<div className="flex flex-col" bis_skin_checked="1">
				<h4 className="text-3xl font-bold">Иван Георгиевич Джуха</h4>
				<p className="dark:text-gray-800">C 1977 занимается изучением истории своего народа. С 2004 И. Джуха — руководитель проекта «Греческий мартиролог». Целью проекта является комплексное исследование репрессий в отношении греческого народа в СССР, сохранение памяти о погибших и пострадавших людях. За реализацию проекта «Греческий мартиролог» И. Г. Джуха в 2006 награждён золотой медалью мэрии города Салоники «За вклад в развитие эллинизма»</p>
        {/* <a className="button button--primary button--lg" href="http://www.greek-martirolog.ru/"> Сайт проекта  </a> */}
			</div>
		</div>
    </div>
  );
}



export default function Home() {
  return (
    <span>
      <Contacts />
    </span>
  );
}