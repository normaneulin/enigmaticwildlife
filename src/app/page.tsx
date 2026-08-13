import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logoPlaceholder}>EnWild</div>
        <nav className={styles.nav}>
          <a href="#about">About</a>
          <a href="#work">Our Work</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Alliance for the Conservation of Enigmatic Wildlife</h1>
          <p className={styles.tagline}>Every species matters. Every voice counts.</p>
          <a href="#join" className={styles.cta}>Join the Alliance</a>
        </section>
        
        <section className={styles.content}>
          <div className={styles.card}>
            <h3>Protecting Biodiversity</h3>
            <p>Our commitment to safeguarding the most enigmatic species on the planet.</p>
          </div>
          <div className={styles.card}>
            <h3>Community Action</h3>
            <p>Empowering local communities to be stewards of conservation.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} EnWild. Every species matters. Every voice counts.</p>
      </footer>
    </div>
  );
}
