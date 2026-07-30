const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const mockFetch = async (url, options = {}) => {
  await delay(200 + Math.random() * 300);

  const { method = 'GET', body } = options;

  if (method === 'GET') {
    const [base, queryString] = url.split('?');
    const params = queryString ? Object.fromEntries(new URLSearchParams(queryString)) : {};

    if (base.endsWith('/users')) {
      const { default: users } = await import('../data/users');
      if (params.search) {
        return users.filter((u) =>
          u.name.toLowerCase().includes(params.search.toLowerCase()) ||
          u.phone.includes(params.search)
        );
      }
      return users;
    }

    if (base.includes('/users/') && base.endsWith('/profile')) {
      const { default: users } = await import('../data/users');
      const id = base.split('/')[base.split('/').indexOf('users') + 1];
      return users.find((u) => u.id === id) || null;
    }

    if (base.endsWith('/chats')) {
      const { default: chats } = await import('../data/chats');
      return params.search
        ? chats.filter((c) =>
            c.name.toLowerCase().includes(params.search.toLowerCase())
          )
        : chats;
    }

    if (base.includes('/chats/') && base.endsWith('/messages')) {
      const { default: messages } = await import('../data/messages');
      const chatId = base.split('/')[base.split('/').indexOf('chats') + 1];
      return messages[chatId] || [];
    }

    if (base.endsWith('/calls')) {
      const { default: calls } = await import('../data/calls');
      return calls;
    }

    if (base.endsWith('/status')) {
      const { default: status } = await import('../data/status');
      return status;
    }

    if (base.endsWith('/me')) {
      const { default: users } = await import('../data/users');
      return users.find((u) => u.isMe) || users[0];
    }
  }

  if (method === 'POST') {
    const parsed = body ? JSON.parse(body) : {};

    if (base.endsWith('/messages')) {
      return {
        id: `msg_${Date.now()}`,
        ...parsed,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
    }

    if (base.endsWith('/status')) {
      return {
        id: `status_${Date.now()}`,
        ...parsed,
        timestamp: new Date().toISOString(),
        views: 0,
      };
    }
  }

  if (method === 'PUT') {
    return { success: true };
  }

  if (method === 'DELETE') {
    return { success: true };
  }

  return null;
};
