import Button from '../Button';
import renderer from 'react-test-renderer';

import {ReactComponent as Plus} from '@svgs/PlusSign.svg';

describe('<Button/>', () => {
  it('Renders without crashing', () => {
    const comp = renderer.create(<Button></Button>).toJSON();

    expect(comp).toMatchSnapshot();
  });

  it("Renders it's children", () => {
    const comp = renderer.create(<Button>Hello</Button>).toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.children).not.toEqual(null);
  });

  it('Renders the primary styles', () => {
    const comp = renderer.create(<Button>Button</Button>).toJSON();
    const comp_withIcon = renderer
      .create(
        <Button>
          <Plus /> Button
        </Button>
      )
      .toJSON();
    const comp_iconOnly = renderer
      .create(
        <Button>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_disabled = renderer
      .create(
        <Button disabled>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_small = renderer
      .create(
        <Button small>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_large = renderer
      .create(
        <Button large>
          <Plus />
        </Button>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp_withIcon).toMatchSnapshot();
    expect(comp_iconOnly).toMatchSnapshot();
    expect(comp_disabled).toMatchSnapshot();
    expect(comp_small).toMatchSnapshot();
    expect(comp_large).toMatchSnapshot();
  });

  it('Renders the primary red styles', () => {
    const comp = renderer.create(<Button red>Button</Button>).toJSON();
    const comp_withIcon = renderer
      .create(
        <Button red>
          <Plus /> Button
        </Button>
      )
      .toJSON();
    const comp_iconOnly = renderer
      .create(
        <Button red>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_disabled = renderer
      .create(
        <Button red disabled>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_small = renderer
      .create(
        <Button red small>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_large = renderer
      .create(
        <Button red large>
          <Plus />
        </Button>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp_withIcon).toMatchSnapshot();
    expect(comp_iconOnly).toMatchSnapshot();
    expect(comp_disabled).toMatchSnapshot();
    expect(comp_small).toMatchSnapshot();
    expect(comp_large).toMatchSnapshot();
  });

  it('Renders the primary dark styles', () => {
    const comp = renderer.create(<Button dark>Button</Button>).toJSON();
    const comp_withIcon = renderer
      .create(
        <Button dark>
          <Plus /> Button
        </Button>
      )
      .toJSON();
    const comp_iconOnly = renderer
      .create(
        <Button dark>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_disabled = renderer
      .create(
        <Button dark disabled>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_small = renderer
      .create(
        <Button dark small>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_large = renderer
      .create(
        <Button dark large>
          <Plus />
        </Button>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp_withIcon).toMatchSnapshot();
    expect(comp_iconOnly).toMatchSnapshot();
    expect(comp_disabled).toMatchSnapshot();
    expect(comp_small).toMatchSnapshot();
    expect(comp_large).toMatchSnapshot();
  });

  it('Renders the secondary styles', () => {
    const comp = renderer.create(<Button secondary>Button</Button>).toJSON();
    const comp_withIcon = renderer
      .create(
        <Button secondary>
          <Plus /> Button
        </Button>
      )
      .toJSON();
    const comp_iconOnly = renderer
      .create(
        <Button secondary>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_disabled = renderer
      .create(
        <Button secondary disabled>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_small = renderer
      .create(
        <Button secondary small>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_large = renderer
      .create(
        <Button secondary large>
          <Plus />
        </Button>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp_withIcon).toMatchSnapshot();
    expect(comp_iconOnly).toMatchSnapshot();
    expect(comp_disabled).toMatchSnapshot();
    expect(comp_small).toMatchSnapshot();
    expect(comp_large).toMatchSnapshot();
  });

  it('Renders the secondary vertical styles', () => {
    const comp = renderer
      .create(
        <Button secondary vertical>
          Button
        </Button>
      )
      .toJSON();
    const comp_withIcon = renderer
      .create(
        <Button secondary vertical>
          <Plus /> Button
        </Button>
      )
      .toJSON();
    const comp_iconOnly = renderer
      .create(
        <Button secondary vertical>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_disabled = renderer
      .create(
        <Button secondary vertical disabled>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_small = renderer
      .create(
        <Button secondary vertical small>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_large = renderer
      .create(
        <Button secondary vertical large>
          <Plus />
        </Button>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp_withIcon).toMatchSnapshot();
    expect(comp_iconOnly).toMatchSnapshot();
    expect(comp_disabled).toMatchSnapshot();
    expect(comp_small).toMatchSnapshot();
    expect(comp_large).toMatchSnapshot();
  });

  it('Renders the tertiary styles', () => {
    const comp = renderer.create(<Button tertiary>Button</Button>).toJSON();
    const comp_withIcon = renderer
      .create(
        <Button tertiary>
          <Plus /> Button
        </Button>
      )
      .toJSON();
    const comp_iconOnly = renderer
      .create(
        <Button tertiary>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_disabled = renderer
      .create(
        <Button tertiary disabled>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_small = renderer
      .create(
        <Button tertiary small>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_large = renderer
      .create(
        <Button tertiary large>
          <Plus />
        </Button>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp_withIcon).toMatchSnapshot();
    expect(comp_iconOnly).toMatchSnapshot();
    expect(comp_disabled).toMatchSnapshot();
    expect(comp_small).toMatchSnapshot();
    expect(comp_large).toMatchSnapshot();
  });

  it('Renders the tertiary blue styles', () => {
    const comp = renderer
      .create(
        <Button tertiary blue>
          Button
        </Button>
      )
      .toJSON();
    const comp_withIcon = renderer
      .create(
        <Button tertiary blue>
          <Plus /> Button
        </Button>
      )
      .toJSON();
    const comp_iconOnly = renderer
      .create(
        <Button tertiary blue>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_disabled = renderer
      .create(
        <Button tertiary blue disabled>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_small = renderer
      .create(
        <Button tertiary blue small>
          <Plus />
        </Button>
      )
      .toJSON();
    const comp_large = renderer
      .create(
        <Button tertiary blue large>
          <Plus />
        </Button>
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp_withIcon).toMatchSnapshot();
    expect(comp_iconOnly).toMatchSnapshot();
    expect(comp_disabled).toMatchSnapshot();
    expect(comp_small).toMatchSnapshot();
    expect(comp_large).toMatchSnapshot();
  });

  it('Renders with a custom classname', () => {
    const comp = renderer
      .create(<Button className="testClass"></Button>)
      .toJSON();

    expect(comp).toMatchSnapshot();
    expect(comp.props.className).toMatch(/testClass/i);
  });
});
