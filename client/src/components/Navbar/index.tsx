import './navbar.scss'
import IconLink from './IconLink'
const reqSvgs = require.context('../../static/svg/', true, /\.svg$/)

interface NavbarIcon {
    iconName: string
}

interface Props {
    data: {
        iconList: NavbarIcon[]
    }
}

const Navbar: React.FunctionComponent<Props> = ({ data }) => {
    return (
        <aside className="navbar">
            {data.iconList.map(el => (
                <IconLink
                    key={el.iconName}
                    src={reqSvgs(`./${el.iconName}.svg`).default}
                    alt={el.iconName}
                />
            ))}
        </aside>

    );
}

export default Navbar;