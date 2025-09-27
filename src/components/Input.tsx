"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

// Common Uniswap V4 tokens (you can expand this list)
const UNISWAP_TOKENS = [
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH (Wrapped Ethereum)
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  },
  {
    address: '0xA0b86a33E6441E6EC0C48E56B9E86b8FA8C15707', // USDC
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86a33E6441E6EC0C48E56B9E86b8FA8C15707/logo.png'
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
  },
  {
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // AAVE
    symbol: 'AAVE',
    name: 'Aave Token',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png'
  },
  {
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
    symbol: 'LINK',
    name: 'ChainLink Token',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png'
  }
];

// Note: For native ETH (not wrapped), you would typically use:
// - address: '0x0000000000000000000000000000000000000000' or
// - address: 'ETH' or 
// - no address field at all
// depending on your application's requirements

// If you need native ETH as well:
const ETH_TOKEN = {
  address: '0x0000000000000000000000000000000000000000', // Common convention for native ETH
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  logoURI: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
};

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
}

interface TokenInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onTokenSelect?: (token: Token) => void;
  selectedToken?: Token;
  placeholder?: string;
  disabled?: boolean;
}

const Input: React.FC<TokenInputProps> = ({
  value = '',
  onChange,
  onTokenSelect,
  selectedToken,
  placeholder = '0.0',
  disabled = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Combine ETH with other tokens
  const ALL_TOKENS = [ETH_TOKEN, ...UNISWAP_TOKENS];
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(ALL_TOKENS);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter tokens based on search query
  useEffect(() => {
    const filtered = ALL_TOKENS.filter(token =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchQuery]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const handleTokenSelect = (token: Token) => {
    onTokenSelect?.(token);
    setIsModalOpen(false);
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow numbers and decimals
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange?.(inputValue);
    }
  };
  
  // Ensure the component is not in a disabled state by default
  const isDisabled = disabled === true;

  return (
    <>
      <div className="w-full bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-white/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-md">Amount</span>
          {selectedToken && (
            <span className="text-white text-md">
              Balance: 0.00 {selectedToken.symbol}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Token Amount Input */}
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={isDisabled}
            className="flex-1 w-[20%] bg-transparent text-white text-5xl font-medium placeholder-white/50 outline-none"
          />
          
          {/* Token Select Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-2 rounded-full transition-colors border border-gray-700 hover:border-gray-600"
            disabled={isDisabled}
          >
            {selectedToken ? (
              <>
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/24x24/3b82f6/ffffff?text=${selectedToken.symbol.charAt(0)}`;
                  }}
                />
                <span className="text-white text-xl cursor-pointer font-medium">{selectedToken.symbol}</span>
              </>
            ) : (
              <span className="text-white">Select Token</span>
            )}
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Token Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-[#1a1a1a] rounded-2xl w-full max-w-md max-h-[80vh] border border-gray-800"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Select Token</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Token List */}
            <div className="overflow-y-auto max-h-80">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <button
                    key={token.address}
                    onClick={() => handleTokenSelect(token)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-800 transition-colors text-left"
                  >
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/40x40/3b82f6/ffffff?text=${token.symbol.charAt(0)}`;
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{token.symbol}</div>
                      <div className="text-white text-sm">{token.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">0.00</div>
                      <div className="text-white text-sm">$0.00</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-white">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tokens found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Input;