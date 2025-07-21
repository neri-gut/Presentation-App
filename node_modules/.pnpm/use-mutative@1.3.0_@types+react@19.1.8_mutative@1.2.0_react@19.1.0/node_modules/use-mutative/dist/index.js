import { create, } from 'mutative';
import { useState, useReducer, useCallback, useMemo, useRef, useEffect, } from 'react';
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
function useMutative(
/**
 * The initial state. You may optionally provide an initializer function to calculate the initial state.
 */
initialValue, 
/**
 * Options for the `useMutative` hook.
 */
options) {
    const patchesRef = useRef({
        patches: [],
        inversePatches: [],
    });
    //#region support strict mode and concurrent features
    const count = useRef(0);
    const renderCount = useRef(0);
    let currentCount = count.current;
    useEffect(() => {
        count.current = currentCount;
        renderCount.current = currentCount;
    });
    currentCount += 1;
    renderCount.current += 1;
    //#endregion
    const [state, setState] = useState(() => typeof initialValue === 'function' ? initialValue() : initialValue);
    const updateState = useCallback((updater) => {
        setState((latest) => {
            const updaterFn = typeof updater === 'function' ? updater : () => updater;
            const result = create(latest, updaterFn, options);
            if (options === null || options === void 0 ? void 0 : options.enablePatches) {
                // check render count, support strict mode and concurrent features
                if (renderCount.current === count.current ||
                    renderCount.current === count.current + 1) {
                    Array.prototype.push.apply(patchesRef.current.patches, result[1]);
                    // `inversePatches` should be in reverse order when multiple setState() executions
                    Array.prototype.unshift.apply(patchesRef.current.inversePatches, result[2]);
                }
                return result[0];
            }
            return result;
        });
    }, []);
    useEffect(() => {
        if (options === null || options === void 0 ? void 0 : options.enablePatches) {
            // Reset `patchesRef` when the component is rendered each time
            patchesRef.current.patches = [];
            patchesRef.current.inversePatches = [];
        }
    });
    return ((options === null || options === void 0 ? void 0 : options.enablePatches)
        ? [
            state,
            updateState,
            patchesRef.current.patches,
            patchesRef.current.inversePatches,
        ]
        : [state, updateState]);
}
/**
 * `useMutativeReducer` is a hook that is similar to `useReducer` but it uses `mutative` to handle the state updates.
 *
 * @example
 *
 * ```ts
 * import { act, renderHook } from '@testing-library/react';
 * import { type Draft } from 'mutative';
 *
 * import { useMutativeReducer } from '../src/index';
 *
 * const { result } = renderHook(() =>
 *   useMutativeReducer(
 *     (
 *       draft: Draft<Readonly<{ count: number }>>,
 *       action: {
 *         type: 'increment';
 *       }
 *     ) => {
 *       switch (action.type) {
 *         case 'increment':
 *           draft.count += 1;
 *       }
 *     },
 *     { count: 0 }
 *   )
 * );
 * const [, dispatch] = result.current;
 * act(() => dispatch({ type: 'increment' }));
 * expect(result.current[0]).toEqual({ count: 1 });
 * ```
 */
function useMutativeReducer(
/**
 * A function that returns the next state tree, given the current state tree and the action to handle.
 */
reducer, 
/**
 * The initial state. You may optionally provide an initializer function to calculate the initial state.
 */
initializerArg, 
/**
 * An initializer function that returns the initial state. It will be called with `initializerArg`.
 */
initializer, 
/**
 * Options for the `useMutativeReducer` hook.
 */
options) {
    const patchesRef = useRef({
        patches: [],
        inversePatches: [],
    });
    //#region support strict mode and concurrent features
    const count = useRef(0);
    const renderCount = useRef(0);
    let currentCount = count.current;
    useEffect(() => {
        count.current = currentCount;
        renderCount.current = currentCount;
    });
    currentCount += 1;
    renderCount.current += 1;
    //#endregion
    const cachedReducer = useMemo(() => (state, action) => {
        const result = create(state, (draft) => reducer(draft, action), options);
        if (options === null || options === void 0 ? void 0 : options.enablePatches) {
            // check render count, support strict mode and concurrent features
            if (renderCount.current === count.current ||
                renderCount.current === count.current + 1) {
                Array.prototype.push.apply(patchesRef.current.patches, result[1]);
                // `inversePatches` should be in reverse order when multiple setState() executions
                Array.prototype.unshift.apply(patchesRef.current.inversePatches, result[2]);
            }
            return result[0];
        }
        return result;
    }, [reducer]);
    const result = useReducer(cachedReducer, initializerArg, initializer);
    useEffect(() => {
        if (options === null || options === void 0 ? void 0 : options.enablePatches) {
            // Reset `patchesRef` when the component is rendered each time
            patchesRef.current.patches = [];
            patchesRef.current.inversePatches = [];
        }
    });
    return (options === null || options === void 0 ? void 0 : options.enablePatches)
        ? [
            result[0],
            result[1],
            patchesRef.current.patches,
            patchesRef.current.inversePatches,
        ]
        : result;
}
export { useMutative, useMutativeReducer, };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLE1BQU0sR0FLUCxNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixXQUFXLEVBQ1gsT0FBTyxFQUNQLE1BQU0sRUFFTixTQUFTLEdBQ1YsTUFBTSxPQUFPLENBQUM7QUE0QmY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBQ0gsU0FBUyxXQUFXO0FBS2xCOztHQUVHO0FBQ0gsWUFBZTtBQUNmOztHQUVHO0FBQ0gsT0FBdUI7SUFFdkIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUd0QjtRQUNELE9BQU8sRUFBRSxFQUFFO1FBQ1gsY0FBYyxFQUFFLEVBQUU7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gscURBQXFEO0lBQ3JELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUNqQyxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsS0FBSyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7UUFDN0IsV0FBVyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDSCxZQUFZLElBQUksQ0FBQyxDQUFDO0lBQ2xCLFdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO0lBQ3pCLFlBQVk7SUFDWixNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FDdEMsT0FBTyxZQUFZLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUNuRSxDQUFDO0lBQ0YsTUFBTSxXQUFX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TyxHQUFHLEVBQUUsQ0FBQztZQUNoQyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDekMsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxhQUFhO1FBQzNCLENBQUMsQ0FBQztZQUNFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPO1lBQzFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYztTQUNMO1FBQ2hDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDYixDQUFDO0FBRUQsT0FBTyxFQUlMLFdBQVcsRUFDWCxrQkFBa0IsR0FDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGNyZWF0ZSxcbiAgdHlwZSBJbW11dGFibGUsXG4gIHR5cGUgUGF0Y2hlcyxcbiAgdHlwZSBPcHRpb25zLFxuICB0eXBlIERyYWZ0LFxufSBmcm9tICdtdXRhdGl2ZSc7XG5pbXBvcnQge1xuICB1c2VTdGF0ZSxcbiAgdXNlUmVkdWNlcixcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZU1lbW8sXG4gIHVzZVJlZixcbiAgRGlzcGF0Y2gsXG4gIHVzZUVmZmVjdCxcbn0gZnJvbSAncmVhY3QnO1xuXG50eXBlIFBhdGNoZXNPcHRpb25zID1cbiAgfCBib29sZWFuXG4gIHwge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAuIElmIGl0J3MgYHRydWVgLCB0aGUgcGF0aCB3aWxsIGJlIGFuIGFycmF5LCBvdGhlcndpc2UgaXQgaXMgYSBzdHJpbmcuXG4gICAgICAgKi9cbiAgICAgIHBhdGhBc0FycmF5PzogYm9vbGVhbjtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgLiBJZiBpdCdzIGB0cnVlYCwgdGhlIGFycmF5IGxlbmd0aCB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZSBwYXRjaGVzLCBvdGhlcndpc2Ugbm8gaW5jbHVkZSBhcnJheSBsZW5ndGguXG4gICAgICAgKi9cbiAgICAgIGFycmF5TGVuZ3RoQXNzaWdubWVudD86IGJvb2xlYW47XG4gICAgfTtcblxudHlwZSBEcmFmdEZ1bmN0aW9uPFM+ID0gKGRyYWZ0OiBEcmFmdDxTPikgPT4gdm9pZDtcbnR5cGUgVXBkYXRlcjxTPiA9ICh2YWx1ZTogUyB8ICgoKSA9PiBTKSB8IERyYWZ0RnVuY3Rpb248Uz4pID0+IHZvaWQ7XG5cbnR5cGUgSW5pdGlhbFZhbHVlPEkgZXh0ZW5kcyBhbnk+ID0gSSBleHRlbmRzICguLi5hcmdzOiBhbnkpID0+IGluZmVyIFIgPyBSIDogSTtcblxudHlwZSBSZXN1bHQ8UywgTyBleHRlbmRzIFBhdGNoZXNPcHRpb25zLCBGIGV4dGVuZHMgYm9vbGVhbj4gPSBPIGV4dGVuZHNcbiAgfCB0cnVlXG4gIHwgb2JqZWN0XG4gID8gW0YgZXh0ZW5kcyB0cnVlID8gSW1tdXRhYmxlPFM+IDogUywgVXBkYXRlcjxTPiwgUGF0Y2hlczxPPiwgUGF0Y2hlczxPPl1cbiAgOiBGIGV4dGVuZHMgdHJ1ZVxuICAgID8gW0ltbXV0YWJsZTxTPiwgVXBkYXRlcjxTPl1cbiAgICA6IFtTLCBVcGRhdGVyPFM+XTtcblxuLyoqXG4gKiBgdXNlTXV0YXRpdmVgIGlzIGEgaG9vayB0aGF0IGlzIHNpbWlsYXIgdG8gYHVzZVN0YXRlYCBidXQgaXQgdXNlcyBgbXV0YXRpdmVgIHRvIGhhbmRsZSB0aGUgc3RhdGUgdXBkYXRlcy5cbiAqXG4gKiAgQGV4YW1wbGVcbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgYWN0LCByZW5kZXJIb29rIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCc7XG4gKlxuICogaW1wb3J0IHsgdXNlTXV0YXRpdmUgfSBmcm9tICcuLi9zcmMvaW5kZXgnO1xuICpcbiAqIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZU11dGF0aXZlKHsgaXRlbXM6IFsxXSB9KSk7XG4gKiBjb25zdCBbc3RhdGUsIHVwZGF0ZVN0YXRlXSA9IHJlc3VsdC5jdXJyZW50O1xuICogYWN0KCgpID0+XG4gKiAgIHVwZGF0ZVN0YXRlKChkcmFmdCkgPT4ge1xuICogICAgIGRyYWZ0Lml0ZW1zLnB1c2goMik7XG4gKiAgIH0pXG4gKiApO1xuICogY29uc3QgW25leHRTdGF0ZV0gPSByZXN1bHQuY3VycmVudDtcbiAqIGV4cGVjdChuZXh0U3RhdGUpLnRvRXF1YWwoeyBpdGVtczogWzEsIDJdIH0pO1xuICogYGBgXG4gKi9cbmZ1bmN0aW9uIHVzZU11dGF0aXZlPFxuICBTLFxuICBGIGV4dGVuZHMgYm9vbGVhbiA9IGZhbHNlLFxuICBPIGV4dGVuZHMgUGF0Y2hlc09wdGlvbnMgPSBmYWxzZSxcbj4oXG4gIC8qKlxuICAgKiBUaGUgaW5pdGlhbCBzdGF0ZS4gWW91IG1heSBvcHRpb25hbGx5IHByb3ZpZGUgYW4gaW5pdGlhbGl6ZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIHRoZSBpbml0aWFsIHN0YXRlLlxuICAgKi9cbiAgaW5pdGlhbFZhbHVlOiBTLFxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgdGhlIGB1c2VNdXRhdGl2ZWAgaG9vay5cbiAgICovXG4gIG9wdGlvbnM/OiBPcHRpb25zPE8sIEY+XG4pIHtcbiAgY29uc3QgcGF0Y2hlc1JlZiA9IHVzZVJlZjx7XG4gICAgcGF0Y2hlczogUGF0Y2hlcztcbiAgICBpbnZlcnNlUGF0Y2hlczogUGF0Y2hlcztcbiAgfT4oe1xuICAgIHBhdGNoZXM6IFtdLFxuICAgIGludmVyc2VQYXRjaGVzOiBbXSxcbiAgfSk7XG4gIC8vI3JlZ2lvbiBzdXBwb3J0IHN0cmljdCBtb2RlIGFuZCBjb25jdXJyZW50IGZlYXR1cmVzXG4gIGNvbnN0IGNvdW50ID0gdXNlUmVmKDApO1xuICBjb25zdCByZW5kZXJDb3VudCA9IHVzZVJlZigwKTtcbiAgbGV0IGN1cnJlbnRDb3VudCA9IGNvdW50LmN1cnJlbnQ7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY291bnQuY3VycmVudCA9IGN1cnJlbnRDb3VudDtcbiAgICByZW5kZXJDb3VudC5jdXJyZW50ID0gY3VycmVudENvdW50O1xuICB9KTtcbiAgY3VycmVudENvdW50ICs9IDE7XG4gIHJlbmRlckNvdW50LmN1cnJlbnQgKz0gMTtcbiAgLy8jZW5kcmVnaW9uXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoKCkgPT5cbiAgICB0eXBlb2YgaW5pdGlhbFZhbHVlID09PSAnZnVuY3Rpb24nID8gaW5pdGlhbFZhbHVlKCkgOiBpbml0aWFsVmFsdWVcbiAgKTtcbiAgY29uc3QgdXBkYXRlU3RhdGUgPSB1c2VDYWxsYmFjaygodXBkYXRlcjogYW55KSA9PiB7XG4gICAgc2V0U3RhdGUoKGxhdGVzdDogYW55KSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVyRm4gPSB0eXBlb2YgdXBkYXRlciA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZXIgOiAoKSA9PiB1cGRhdGVyO1xuICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlKGxhdGVzdCwgdXBkYXRlckZuLCBvcHRpb25zKTtcbiAgICAgIGlmIChvcHRpb25zPy5lbmFibGVQYXRjaGVzKSB7XG4gICAgICAgIC8vIGNoZWNrIHJlbmRlciBjb3VudCwgc3VwcG9ydCBzdHJpY3QgbW9kZSBhbmQgY29uY3VycmVudCBmZWF0dXJlc1xuICAgICAgICBpZiAoXG4gICAgICAgICAgcmVuZGVyQ291bnQuY3VycmVudCA9PT0gY291bnQuY3VycmVudCB8fFxuICAgICAgICAgIHJlbmRlckNvdW50LmN1cnJlbnQgPT09IGNvdW50LmN1cnJlbnQgKyAxXG4gICAgICAgICkge1xuICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHBhdGNoZXNSZWYuY3VycmVudC5wYXRjaGVzLCByZXN1bHRbMV0pO1xuICAgICAgICAgIC8vIGBpbnZlcnNlUGF0Y2hlc2Agc2hvdWxkIGJlIGluIHJldmVyc2Ugb3JkZXIgd2hlbiBtdWx0aXBsZSBzZXRTdGF0ZSgpIGV4ZWN1dGlvbnNcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShcbiAgICAgICAgICAgIHBhdGNoZXNSZWYuY3VycmVudC5pbnZlcnNlUGF0Y2hlcyxcbiAgICAgICAgICAgIHJlc3VsdFsyXVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFswXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG4gIH0sIFtdKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAob3B0aW9ucz8uZW5hYmxlUGF0Y2hlcykge1xuICAgICAgLy8gUmVzZXQgYHBhdGNoZXNSZWZgIHdoZW4gdGhlIGNvbXBvbmVudCBpcyByZW5kZXJlZCBlYWNoIHRpbWVcbiAgICAgIHBhdGNoZXNSZWYuY3VycmVudC5wYXRjaGVzID0gW107XG4gICAgICBwYXRjaGVzUmVmLmN1cnJlbnQuaW52ZXJzZVBhdGNoZXMgPSBbXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKFxuICAgIG9wdGlvbnM/LmVuYWJsZVBhdGNoZXNcbiAgICAgID8gW1xuICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgIHVwZGF0ZVN0YXRlLFxuICAgICAgICAgIHBhdGNoZXNSZWYuY3VycmVudC5wYXRjaGVzLFxuICAgICAgICAgIHBhdGNoZXNSZWYuY3VycmVudC5pbnZlcnNlUGF0Y2hlcyxcbiAgICAgICAgXVxuICAgICAgOiBbc3RhdGUsIHVwZGF0ZVN0YXRlXVxuICApIGFzIFJlc3VsdDxJbml0aWFsVmFsdWU8Uz4sIE8sIEY+O1xufVxuXG50eXBlIFJlZHVjZXJSZXN1bHQ8XG4gIFMsXG4gIEEsXG4gIE8gZXh0ZW5kcyBQYXRjaGVzT3B0aW9ucyxcbiAgRiBleHRlbmRzIGJvb2xlYW4sXG4+ID0gTyBleHRlbmRzIHRydWUgfCBvYmplY3RcbiAgPyBbRiBleHRlbmRzIHRydWUgPyBJbW11dGFibGU8Uz4gOiBTLCBEaXNwYXRjaDxBPiwgUGF0Y2hlczxPPiwgUGF0Y2hlczxPPl1cbiAgOiBGIGV4dGVuZHMgdHJ1ZVxuICAgID8gW0ltbXV0YWJsZTxTPiwgRGlzcGF0Y2g8QT5dXG4gICAgOiBbUywgRGlzcGF0Y2g8QT5dO1xuXG50eXBlIFJlZHVjZXI8UywgQT4gPSAoZHJhZnRTdGF0ZTogRHJhZnQ8Uz4sIGFjdGlvbjogQSkgPT4gdm9pZCB8IFMgfCB1bmRlZmluZWQ7XG5cbmZ1bmN0aW9uIHVzZU11dGF0aXZlUmVkdWNlcjxcbiAgUyxcbiAgQSxcbiAgSSxcbiAgRiBleHRlbmRzIGJvb2xlYW4gPSBmYWxzZSxcbiAgTyBleHRlbmRzIFBhdGNoZXNPcHRpb25zID0gZmFsc2UsXG4+KFxuICByZWR1Y2VyOiBSZWR1Y2VyPFMsIEE+LFxuICBpbml0aWFsaXplckFyZzogUyAmIEksXG4gIGluaXRpYWxpemVyOiAoYXJnOiBTICYgSSkgPT4gUyxcbiAgb3B0aW9ucz86IE9wdGlvbnM8TywgRj5cbik6IFJlZHVjZXJSZXN1bHQ8UywgQSwgTywgRj47XG5cbmZ1bmN0aW9uIHVzZU11dGF0aXZlUmVkdWNlcjxcbiAgUyxcbiAgQSxcbiAgSSxcbiAgRiBleHRlbmRzIGJvb2xlYW4gPSBmYWxzZSxcbiAgTyBleHRlbmRzIFBhdGNoZXNPcHRpb25zID0gZmFsc2UsXG4+KFxuICByZWR1Y2VyOiBSZWR1Y2VyPFMsIEE+LFxuICBpbml0aWFsaXplckFyZzogSSxcbiAgaW5pdGlhbGl6ZXI6IChhcmc6IEkpID0+IFMsXG4gIG9wdGlvbnM/OiBPcHRpb25zPE8sIEY+XG4pOiBSZWR1Y2VyUmVzdWx0PFMsIEEsIE8sIEY+O1xuXG5mdW5jdGlvbiB1c2VNdXRhdGl2ZVJlZHVjZXI8XG4gIFMsXG4gIEEsXG4gIEYgZXh0ZW5kcyBib29sZWFuID0gZmFsc2UsXG4gIE8gZXh0ZW5kcyBQYXRjaGVzT3B0aW9ucyA9IGZhbHNlLFxuPihcbiAgcmVkdWNlcjogUmVkdWNlcjxTLCBBPixcbiAgaW5pdGlhbFN0YXRlOiBTLFxuICBpbml0aWFsaXplcj86IHVuZGVmaW5lZCxcbiAgb3B0aW9ucz86IE9wdGlvbnM8TywgRj5cbik6IFJlZHVjZXJSZXN1bHQ8UywgQSwgTywgRj47XG5cbi8qKlxuICogYHVzZU11dGF0aXZlUmVkdWNlcmAgaXMgYSBob29rIHRoYXQgaXMgc2ltaWxhciB0byBgdXNlUmVkdWNlcmAgYnV0IGl0IHVzZXMgYG11dGF0aXZlYCB0byBoYW5kbGUgdGhlIHN0YXRlIHVwZGF0ZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgYWN0LCByZW5kZXJIb29rIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCc7XG4gKiBpbXBvcnQgeyB0eXBlIERyYWZ0IH0gZnJvbSAnbXV0YXRpdmUnO1xuICpcbiAqIGltcG9ydCB7IHVzZU11dGF0aXZlUmVkdWNlciB9IGZyb20gJy4uL3NyYy9pbmRleCc7XG4gKlxuICogY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAqICAgdXNlTXV0YXRpdmVSZWR1Y2VyKFxuICogICAgIChcbiAqICAgICAgIGRyYWZ0OiBEcmFmdDxSZWFkb25seTx7IGNvdW50OiBudW1iZXIgfT4+LFxuICogICAgICAgYWN0aW9uOiB7XG4gKiAgICAgICAgIHR5cGU6ICdpbmNyZW1lbnQnO1xuICogICAgICAgfVxuICogICAgICkgPT4ge1xuICogICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICogICAgICAgICBjYXNlICdpbmNyZW1lbnQnOlxuICogICAgICAgICAgIGRyYWZ0LmNvdW50ICs9IDE7XG4gKiAgICAgICB9XG4gKiAgICAgfSxcbiAqICAgICB7IGNvdW50OiAwIH1cbiAqICAgKVxuICogKTtcbiAqIGNvbnN0IFssIGRpc3BhdGNoXSA9IHJlc3VsdC5jdXJyZW50O1xuICogYWN0KCgpID0+IGRpc3BhdGNoKHsgdHlwZTogJ2luY3JlbWVudCcgfSkpO1xuICogZXhwZWN0KHJlc3VsdC5jdXJyZW50WzBdKS50b0VxdWFsKHsgY291bnQ6IDEgfSk7XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gdXNlTXV0YXRpdmVSZWR1Y2VyPFxuICBTLFxuICBBLFxuICBJLFxuICBGIGV4dGVuZHMgYm9vbGVhbiA9IGZhbHNlLFxuICBPIGV4dGVuZHMgUGF0Y2hlc09wdGlvbnMgPSBmYWxzZSxcbj4oXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbmV4dCBzdGF0ZSB0cmVlLCBnaXZlbiB0aGUgY3VycmVudCBzdGF0ZSB0cmVlIGFuZCB0aGUgYWN0aW9uIHRvIGhhbmRsZS5cbiAgICovXG4gIHJlZHVjZXI6IFJlZHVjZXI8UywgQT4sXG4gIC8qKlxuICAgKiBUaGUgaW5pdGlhbCBzdGF0ZS4gWW91IG1heSBvcHRpb25hbGx5IHByb3ZpZGUgYW4gaW5pdGlhbGl6ZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIHRoZSBpbml0aWFsIHN0YXRlLlxuICAgKi9cbiAgaW5pdGlhbGl6ZXJBcmc6IFMgJiBJLFxuICAvKipcbiAgICogQW4gaW5pdGlhbGl6ZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBpbml0aWFsIHN0YXRlLiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGBpbml0aWFsaXplckFyZ2AuXG4gICAqL1xuICBpbml0aWFsaXplcj86IChhcmc6IFMgJiBJKSA9PiBTLFxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgdGhlIGB1c2VNdXRhdGl2ZVJlZHVjZXJgIGhvb2suXG4gICAqL1xuICBvcHRpb25zPzogT3B0aW9uczxPLCBGPlxuKTogUmVkdWNlclJlc3VsdDxTLCBBLCBPLCBGPiB7XG4gIGNvbnN0IHBhdGNoZXNSZWYgPSB1c2VSZWY8e1xuICAgIHBhdGNoZXM6IFBhdGNoZXM7XG4gICAgaW52ZXJzZVBhdGNoZXM6IFBhdGNoZXM7XG4gIH0+KHtcbiAgICBwYXRjaGVzOiBbXSxcbiAgICBpbnZlcnNlUGF0Y2hlczogW10sXG4gIH0pO1xuICAvLyNyZWdpb24gc3VwcG9ydCBzdHJpY3QgbW9kZSBhbmQgY29uY3VycmVudCBmZWF0dXJlc1xuICBjb25zdCBjb3VudCA9IHVzZVJlZigwKTtcbiAgY29uc3QgcmVuZGVyQ291bnQgPSB1c2VSZWYoMCk7XG4gIGxldCBjdXJyZW50Q291bnQgPSBjb3VudC5jdXJyZW50O1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvdW50LmN1cnJlbnQgPSBjdXJyZW50Q291bnQ7XG4gICAgcmVuZGVyQ291bnQuY3VycmVudCA9IGN1cnJlbnRDb3VudDtcbiAgfSk7XG4gIGN1cnJlbnRDb3VudCArPSAxO1xuICByZW5kZXJDb3VudC5jdXJyZW50ICs9IDE7XG4gIC8vI2VuZHJlZ2lvblxuICBjb25zdCBjYWNoZWRSZWR1Y2VyOiBhbnkgPSB1c2VNZW1vKFxuICAgICgpID0+IChzdGF0ZTogYW55LCBhY3Rpb246IGFueSkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSBjcmVhdGUoXG4gICAgICAgIHN0YXRlLFxuICAgICAgICAoZHJhZnQpID0+IHJlZHVjZXIoZHJhZnQsIGFjdGlvbiksXG4gICAgICAgIG9wdGlvbnNcbiAgICAgICk7XG4gICAgICBpZiAob3B0aW9ucz8uZW5hYmxlUGF0Y2hlcykge1xuICAgICAgICAvLyBjaGVjayByZW5kZXIgY291bnQsIHN1cHBvcnQgc3RyaWN0IG1vZGUgYW5kIGNvbmN1cnJlbnQgZmVhdHVyZXNcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHJlbmRlckNvdW50LmN1cnJlbnQgPT09IGNvdW50LmN1cnJlbnQgfHxcbiAgICAgICAgICByZW5kZXJDb3VudC5jdXJyZW50ID09PSBjb3VudC5jdXJyZW50ICsgMVxuICAgICAgICApIHtcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShwYXRjaGVzUmVmLmN1cnJlbnQucGF0Y2hlcywgcmVzdWx0WzFdKTtcbiAgICAgICAgICAvLyBgaW52ZXJzZVBhdGNoZXNgIHNob3VsZCBiZSBpbiByZXZlcnNlIG9yZGVyIHdoZW4gbXVsdGlwbGUgc2V0U3RhdGUoKSBleGVjdXRpb25zXG4gICAgICAgICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoXG4gICAgICAgICAgICBwYXRjaGVzUmVmLmN1cnJlbnQuaW52ZXJzZVBhdGNoZXMsXG4gICAgICAgICAgICByZXN1bHRbMl1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRbMF07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgW3JlZHVjZXJdXG4gICk7XG4gIGNvbnN0IHJlc3VsdDogYW55ID0gdXNlUmVkdWNlcihcbiAgICBjYWNoZWRSZWR1Y2VyLFxuICAgIGluaXRpYWxpemVyQXJnIGFzIGFueSxcbiAgICBpbml0aWFsaXplciBhcyBhbnlcbiAgKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAob3B0aW9ucz8uZW5hYmxlUGF0Y2hlcykge1xuICAgICAgLy8gUmVzZXQgYHBhdGNoZXNSZWZgIHdoZW4gdGhlIGNvbXBvbmVudCBpcyByZW5kZXJlZCBlYWNoIHRpbWVcbiAgICAgIHBhdGNoZXNSZWYuY3VycmVudC5wYXRjaGVzID0gW107XG4gICAgICBwYXRjaGVzUmVmLmN1cnJlbnQuaW52ZXJzZVBhdGNoZXMgPSBbXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3B0aW9ucz8uZW5hYmxlUGF0Y2hlc1xuICAgID8gW1xuICAgICAgICByZXN1bHRbMF0sXG4gICAgICAgIHJlc3VsdFsxXSxcbiAgICAgICAgcGF0Y2hlc1JlZi5jdXJyZW50LnBhdGNoZXMsXG4gICAgICAgIHBhdGNoZXNSZWYuY3VycmVudC5pbnZlcnNlUGF0Y2hlcyxcbiAgICAgIF0gYXMgUmVkdWNlclJlc3VsdDxTLCBBLCBPLCBGPlxuICAgIDogcmVzdWx0O1xufVxuXG5leHBvcnQge1xuICB0eXBlIERyYWZ0RnVuY3Rpb24sXG4gIHR5cGUgVXBkYXRlcixcbiAgdHlwZSBSZWR1Y2VyLFxuICB1c2VNdXRhdGl2ZSxcbiAgdXNlTXV0YXRpdmVSZWR1Y2VyLFxufTtcbiJdfQ==