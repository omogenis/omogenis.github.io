import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Сообщество',
    Svg: require('@site/static/img/Community-bro.svg').default,
    description: (
      <>

      </>
    ),
  },
  {
    title: 'Поддержка',
    Svg: require('@site/static/img/Cheer up-amico.svg').default,
    description: (
      <>

      </>
    ),
  },
  {
    title: 'Взаимовыручка',
    Svg: require('@site/static/img/Back to back-bro.svg').default,
    description: (
      <>

      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
