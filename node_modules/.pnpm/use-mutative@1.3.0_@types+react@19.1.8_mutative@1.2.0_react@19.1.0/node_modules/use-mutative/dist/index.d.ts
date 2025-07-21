import { type Immutable, type Patches, type Options, type Draft } from 'mutative';
import { Dispatch } from 'react';
type PatchesOptions = boolean | {
    /**
     * The default value is `true`. If it's `true`, the path will be an array, otherwise it is a string.
     */
    pathAsArray?: boolean;
    /**
     * The default value is `true`. If it's `true`, the array length will be included in the patches, otherwise no include array length.
     */
    arrayLengthAssignment?: boolean;
};
type DraftFunction<S> = (draft: Draft<S>) => void;
type Updater<S> = (value: S | (() => S) | DraftFunction<S>) => void;
type InitialValue<I extends any> = I extends (...args: any) => infer R ? R : I;
type Result<S, O extends PatchesOptions, F extends boolean> = O extends true | object ? [F extends true ? Immutable<S> : S, Updater<S>, Patches<O>, Patches<O>] : F extends true ? [Immutable<S>, Updater<S>] : [S, Updater<S>];
/**
 * `useMutative` is a hook that is similar to `useState` but it uses `mutative` to handle the state updates.
 *
 *  @example
 *
 * ```ts
 * import { act, renderHook } from '@testing-library/react';
 *
 * import { useMutative } from '../src/index';
 *
 * const { result } = renderHook(() => useMutative({ items: [1] }));
 * const [state, updateState] = result.current;
 * act(() =>
 *   updateState((draft) => {
 *     draft.items.push(2);
 *   })
 * );
 * const [nextState] = result.current;
 * expect(nextState).toEqual({ items: [1, 2] });
 * ```
 */
declare function useMutative<S, F extends boolean = false, O extends PatchesOptions = false>(
/**
 * The initial state. You may optionally provide an initializer function to calculate the initial state.
 */
initialValue: S, 
/**
 * Options for the `useMutative` hook.
 */
options?: Options<O, F>): Result<InitialValue<S>, O, F>;
type ReducerResult<S, A, O extends PatchesOptions, F extends boolean> = O extends true | object ? [F extends true ? Immutable<S> : S, Dispatch<A>, Patches<O>, Patches<O>] : F extends true ? [Immutable<S>, Dispatch<A>] : [S, Dispatch<A>];
type Reducer<S, A> = (draftState: Draft<S>, action: A) => void | S | undefined;
declare function useMutativeReducer<S, A, I, F extends boolean = false, O extends PatchesOptions = false>(reducer: Reducer<S, A>, initializerArg: S & I, initializer: (arg: S & I) => S, options?: Options<O, F>): ReducerResult<S, A, O, F>;
declare function useMutativeReducer<S, A, I, F extends boolean = false, O extends PatchesOptions = false>(reducer: Reducer<S, A>, initializerArg: I, initializer: (arg: I) => S, options?: Options<O, F>): ReducerResult<S, A, O, F>;
declare function useMutativeReducer<S, A, F extends boolean = false, O extends PatchesOptions = false>(reducer: Reducer<S, A>, initialState: S, initializer?: undefined, options?: Options<O, F>): ReducerResult<S, A, O, F>;
export { type DraftFunction, type Updater, type Reducer, useMutative, useMutativeReducer, };
//# sourceMappingURL=index.d.ts.map