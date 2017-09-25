import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

class Menu extends React.Component {
  componentDidMount() {
    window.componentHandler.upgradeElements(findDOMNode(this));
  }
  componentWillUnmount() {
    const element = findDOMNode(this);
    window.componentHandler.downgradeElements(element);
  }
  render() {
    const { children, className, ripple, target} = this.props;
    const classes = classNames('mdl-menu mdl-js-menu',
      {'mdl-js-ripple-effect': ripple}, className);
    return (<ul className={classes} data-mdl-for={target}>{children}</ul>);
  }
}

export default Menu;
