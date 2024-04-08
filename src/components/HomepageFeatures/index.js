import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/easy.svg').default,
    description: (
      <>
        doptime was designed to get rid of most of the jobs .
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/svgviewer-focus.svg').default,
    description: (
      <>
        Doptime lets you focus on your logic only.
      </>
    ),
  },
  {
    title: 'Coming Soon: RPC library',
    Svg: require('@site/static/img/svgviewer-come.svg').default,
    description: (
      <>
        <a href="/docs/introduction"> This that can free from develop lots of APIs .</a>
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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
