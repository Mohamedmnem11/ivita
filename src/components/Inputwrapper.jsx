import React from 'react';

const InputWrapper = React.memo(
  ({ icon: Icon, error, ...props }) => {
    return (
      <div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]">
            <Icon size={14} />
          </span>

          <input
            {...props}
            className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md
            focus:outline-none focus:ring-2
            ${error
              ? 'border-red-500 focus:ring-red-500'
              : 'focus:ring-[var(--color-primary)]'
            }`}
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default InputWrapper;
