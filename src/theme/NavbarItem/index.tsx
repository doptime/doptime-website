
import OriginalNavbarItem from '@theme-original/NavbarItem';;

import { AuthMenu } from '../../components/auth';

const ComponentTypes = {
    'custom-item': AuthMenu,
};

const NavbarItem = (props) => {
    const { type } = props;

    const Component = ComponentTypes[type];
    if (Component) {
        return <Component {...props} />;
    }

    return <OriginalNavbarItem {...props} />;
};

export default NavbarItem;