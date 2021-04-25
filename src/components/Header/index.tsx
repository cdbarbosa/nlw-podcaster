import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'

export const Header =  () => {
    const currentDate = format(new Date, 'EEEEEE, d MMMM', { locale: ptBR })

    return (
        <header className={styles.headerComponent}>
            <img src="/logo.svg" alt="Podcarster logo"/>

            <p>O Melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    )
}
