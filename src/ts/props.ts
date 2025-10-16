/**
 * Every Dash components are given these props.
 * Use with your own props:
 * ```
 * type Props = {
 *     my_prop: string;
 * } & DashComponentProps;
 * ```
 * Recommended to use `type` instead of `interface` so you can define the
 * order of props with types concatenation.
 */

export type setPropsType = (props: Record<string, any>) => void;

export type DashComponentProps = {
  /**
   * Unique ID to identify this component in Dash callbacks.
   */
  id?: string;
  /**
   * Update props to trigger callbacks.
   *
   * NOTE: The setPropsType cannot be used, as it otherwise thinks
   * it is a required argument when creating the dash component.
   */
  setProps: (props: Record<string, any>) => void;
};
