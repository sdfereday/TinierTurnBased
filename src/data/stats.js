import { clamp } from "../helpers/numberHelpers";

export default {
  status: (effectiveStatuses = []) => {
    let _currentStatus = null;
    return {
      id: "status",
      setStatus: type =>
        (_currentStatus = effectiveStatuses.find(
          status => type === status.type
        )),
      clearStatus: () => (_currentStatus = null),
      value: () => (_currentStatus ? _currentStatus.type : null)
    };
  },
  hp: ceil => {
    let _current = ceil;
    let _ceil = ceil;
    let _min = 0;
    return {
      id: "hp",
      value: () => _current,
      ceil: () => _ceil,
      increaseValue: value => {
        _current = clamp(_current + value, _min, _ceil);
      },
      decreaseValue: value => {
        _current = clamp(_current - value, _min, _ceil);
      }
    };
  }
};
