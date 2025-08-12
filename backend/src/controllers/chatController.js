import Conversation from '../models/chat.model.js';

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { title, userLanguage = 'en', location } = req.body;
    const userId = req.user._id; // From JWT middleware

    const conversation = new Conversation({
      userId,
      title: title || 'New conversation',
      userLanguage,
      location: location || null,
      messages: []
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
};

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const conversations = await Conversation.find({ userId })
      .select('title createdAt updatedAt userLanguage messageCount')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations'
    });
  }
};

// Get a specific conversation with all messages
export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation'
    });
  }
};

// Add a message to a conversation
export const addMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { role, content, userLanguage = 'en' } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Add the new message
    conversation.messages.push({
      role,
      content,
      userLanguage,
      timestamp: new Date()
    });

    // Update conversation title if it's the first user message
    if (role === 'user' && conversation.messages.length === 1) {
      conversation.title = content.length > 50 
        ? content.substring(0, 50) + '...' 
        : content;
    }

    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        message: conversation.messages[conversation.messages.length - 1],
        conversationId: conversation._id
      }
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add message'
    });
  }
};

// Update conversation title
export const updateConversationTitle = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, userId },
      { title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Update title error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update conversation title'
    });
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation'
    });
  }
};

// Clear all conversations for a user
export const clearAllConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    await Conversation.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'All conversations cleared successfully'
    });
  } catch (error) {
    console.error('Clear conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversations'
    });
  }
};
