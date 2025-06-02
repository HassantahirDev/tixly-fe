import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import {
  createComment,
  fetchEventById,
  fetchCommentsByEventId,
  createReplyToComment,
  toggleCommentLike, 
  toggleReplyLike, 
} from '@/src/store/slices/homeSlice';
import type { AppDispatch } from '@/src/store/store';
import Payment from '@/app/(payment)';
import Header from '@/src/components/Header';
import RoleNavigation from '@/src/components/Navigation';
import { hasUserId } from '@/src/services/api';
import { getCurrentUserId } from '@/src/services/api';
import { LinearGradient } from 'expo-linear-gradient';
const dummyProfilePic = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function EventDetailsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams();
  const {
    selectedEvent,
    selectedEventLoading,
    selectedEventError,
    eventComments,
    eventCommentsLoading,
    eventCommentsError,
  } = useSelector((state: RootState) => state.home);
  const [activeTab, setActiveTab] = useState('details');
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    type: 'comment' | 'reply';
  } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [closedByUser, setClosedByUser] = useState(false);



  const currentUserId = getCurrentUserId();

  

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id as string));
      dispatch(fetchCommentsByEventId(id as string));
    }
  }, [dispatch, id]);

  const showPaymentComponent = () => {
    setShowPayment(true);
    setClosedByUser(false);
  };

  const closePayment = () => {
    setShowPayment(false);
    setClosedByUser(true);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createComment({ content: commentText, eventId: id as string })
      ).unwrap();
      setCommentText('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (id: string, type: 'comment' | 'reply') => {
    setReplyingTo(
      replyingTo?.id === id && replyingTo?.type === type ? null : { id, type }
    );
    setReplyText('');
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      await dispatch(
        createReplyToComment({ commentId, content: replyText })
      ).unwrap();
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLike = async (id: string, type: 'comment' | 'reply') => {
    try {
      if (type === 'comment') {
        await dispatch(toggleCommentLike(id)).unwrap();
      } else {
        await dispatch(toggleReplyLike(id)).unwrap();
      }
    } catch (error) {
      console.error(`Failed to like ${type}:`, error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('default', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };



  if (selectedEventLoading || eventCommentsLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator color="#FF4B55" size="large" />
      </View>
    );
  }

  if (selectedEventError || !selectedEvent) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={styles.errorText}>
          {selectedEventError || 'Event not found'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[showPayment && styles.dimmedContent]}>
          <Header />
          <LinearGradient
            colors={['rgba(127,1,2,0.7)', 'rgba(11,1,121,0.7)']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.eventCard}
          >
            <View>
              <Image
                source={{ uri: selectedEvent.attachment }}
                style={styles.eventImage}
              />
              <View style={styles.dateChip}>
                <Text style={styles.dateText}>
                  {new Date(selectedEvent.date).getDate()}
                </Text>
                <Text style={styles.monthText}>
                  {new Date(selectedEvent.date).toLocaleString('default', {
                    month: 'short',
                  })}
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons
                    name="share-social-outline"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
            </View>
          </LinearGradient>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={showPaymentComponent}
          >
            <Text style={styles.buyButtonText}>
              Buy it - PKR{' '}
              {selectedEvent?.price != null
                ? selectedEvent.price.toFixed(2)
                : '0.00'}
            </Text>
          </TouchableOpacity>
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>General Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{selectedEvent.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>
                {formatTime(selectedEvent.startTime)} -{' '}
                {formatTime(selectedEvent.endTime)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>
                {formatDate(selectedEvent.date)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>
                {selectedEvent.ageLimit} years +
              </Text>
            </View>
          </View>
          <View style={styles.detailsCard}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'details' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('details')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'details' && styles.activeTabText,
                  ]}
                >
                  Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'comments' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('comments')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'comments' && styles.activeTabText,
                  ]}
                >
                  Comments
                </Text>
              </TouchableOpacity>
            </View>
            {activeTab === 'details' ? (
              <>
                <Text style={styles.description}>
                  {selectedEvent.description}
                </Text>
                <Text style={styles.highlightsTitle}>Highlights</Text>
                <View style={styles.highlightsList}>
                  {selectedEvent.highlights.map((highlight, index) => (
                    <Text key={index} style={styles.highlightItem}>
                      • {highlight}
                    </Text>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.commentsSection}>
                <Text style={styles.commentsCount}>
                  {(eventComments || []).length} Comments
                </Text>
                {eventCommentsError && (
                  <Text style={styles.errorText}>{eventCommentsError}</Text>
                )}
                {(eventComments || []).map((comment) => (
                  <View key={comment.id}>
                    <View style={styles.commentItem}>
                      <Image
                        source={{
                          uri: comment.user.profilePic || dummyProfilePic,
                        }}
                        style={styles.commentAvatar}
                      />
                      <View style={styles.commentContent}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentAuthor}>
                            {comment.user.name}
                          </Text>
                          <Text style={styles.commentTime}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text style={styles.commentText}>
                          {comment.content}
                        </Text>
                        <View style={styles.commentActions}>
                          <TouchableOpacity
                            onPress={() => handleReply(comment.id, 'comment')}
                          >
                            <Text
                              style={[
                                styles.actionText,
                                replyingTo?.id === comment.id &&
                                  replyingTo?.type === 'comment' &&
                                  styles.activeActionText,
                              ]}
                            >
                              Reply
                            </Text>
                          </TouchableOpacity>
                          {comment.replies?.length > 0 && (
                            <>
                              <Text style={styles.actionDot}>•</Text>
                              <TouchableOpacity
                                onPress={() =>
                                  setShowReplies((prev) => ({
                                    ...prev,
                                    [comment.id]: !prev[comment.id],
                                  }))
                                }
                              >
                                <Text style={styles.actionText}>
                                  {showReplies[comment.id]
                                    ? 'Hide Replies'
                                    : `View ${comment.replies.length} Replies`}
                                </Text>
                              </TouchableOpacity>
                            </>
                          )}
                          <Text style={styles.actionDot}>•</Text>
                          <TouchableOpacity
                            onPress={() => handleLike(comment.id, 'comment')}
                          >
                            <Text style={styles.actionText}>
                              {comment.likes?.length || 0}{' '}
                              {comment.likes?.length === 1 ? 'Like' : 'Likes'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => handleLike(comment.id, 'comment')}
                      >
                        <Ionicons
                          name={
                            comment.likes?.some(
                              (like) =>
                                hasUserId(like) && like.userId === currentUserId
                            )
                              ? 'heart'
                              : 'heart-outline'
                          }
                          size={20}
                          color={
                            comment.likes?.some(
                              (like) =>
                                hasUserId(like) && like.userId === currentUserId
                            )
                              ? 'red'
                              : 'white'
                          }
                        />
                      </TouchableOpacity>
                    </View>
                    {replyingTo?.id === comment.id &&
                      replyingTo?.type === 'comment' && (
                        <View style={styles.replyInputContainer}>
                          <Image
                            source={{ uri: dummyProfilePic }}
                            style={styles.replyAvatar}
                          />
                          <View style={styles.replyInput}>
                            <TextInput
                              placeholder="Write a reply..."
                              placeholderTextColor="#999"
                              style={styles.replyTextInput}
                              value={replyText}
                              onChangeText={setReplyText}
                              editable={!isSubmittingReply}
                            />
                            <TouchableOpacity
                              onPress={() => handleSubmitReply(comment.id)}
                              disabled={!replyText.trim() || isSubmittingReply}
                              style={[
                                styles.replyButton,
                                (!replyText.trim() || isSubmittingReply) &&
                                  styles.replyButtonDisabled,
                              ]}
                            >
                              {isSubmittingReply ? (
                                <ActivityIndicator size="small" color="white" />
                              ) : (
                                <Ionicons name="send" size={20} color="white" />
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    {showReplies[comment.id] &&
                      comment.replies?.map((reply) => (
                        <View key={reply.id}>
                          <View style={[styles.commentItem, styles.replyItem]}>
                            <Image
                              source={{
                                uri: reply.user.profilePic || dummyProfilePic,
                              }}
                              style={styles.commentAvatar}
                            />
                            <View style={styles.commentContent}>
                              <View style={styles.commentHeader}>
                                <Text style={styles.commentAuthor}>
                                  {reply.user.name}
                                </Text>
                                <Text style={styles.commentTime}>
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleDateString()}
                                </Text>
                              </View>
                              <Text style={styles.commentText}>
                                {reply.content}
                              </Text>
                              <View style={styles.commentActions}>
                                {/* <TouchableOpacity
                                  onPress={() => handleReply(reply.id, 'reply')}
                                >
                                  <Text
                                    style={[
                                      styles.actionText,
                                      replyingTo?.id === reply.id &&
                                        replyingTo?.type === 'reply' &&
                                        styles.activeActionText,
                                    ]}
                                  >
                                    Reply
                                  </Text>
                                </TouchableOpacity> */}
                                {/* <Text style={styles.actionDot}>•</Text> */}
                                <TouchableOpacity
                                  onPress={() => handleLike(reply.id, 'reply')}
                                >
                                  <Text style={styles.actionText}>
                                    {reply.likes?.length || 0}{' '}
                                    {reply.likes?.length === 1
                                      ? 'Like'
                                      : 'Likes'}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.likeButton}
                              onPress={() => handleLike(reply.id, 'reply')}
                            >
                              <Ionicons
                                name={
                                  reply.likes?.some(
                                    (like) => like.userId === currentUserId
                                  )
                                    ? 'heart'
                                    : 'heart-outline'
                                }
                                size={20}
                                color={
                                  reply.likes?.some(
                                    (like) => like.userId === currentUserId
                                  )
                                    ? 'red'
                                    : 'white'
                                }
                              />
                            </TouchableOpacity>
                          </View>
                          {replyingTo?.id === reply.id &&
                            replyingTo?.type === 'reply' && (
                              <View style={[styles.replyInputContainer]}>
                                <Image
                                  source={{ uri: dummyProfilePic }}
                                  style={styles.replyAvatar}
                                />
                                <View style={styles.replyInput}>
                                  <TextInput
                                    placeholder="Write a reply..."
                                    placeholderTextColor="#999"
                                    style={styles.replyTextInput}
                                    value={replyText}
                                    onChangeText={setReplyText}
                                    editable={!isSubmittingReply}
                                  />
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleSubmitReply(comment.id)
                                    }
                                    disabled={
                                      !replyText.trim() || isSubmittingReply
                                    }
                                    style={[
                                      styles.replyButton,
                                      (!replyText.trim() ||
                                        isSubmittingReply) &&
                                        styles.replyButtonDisabled,
                                    ]}
                                  >
                                    {isSubmittingReply ? (
                                      <ActivityIndicator
                                        size="small"
                                        color="white"
                                      />
                                    ) : (
                                      <Ionicons
                                        name="send"
                                        size={20}
                                        color="white"
                                      />
                                    )}
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                        </View>
                      ))}
                  </View>
                ))}
                <View style={styles.commentInput}>
                  <TextInput
                    placeholder="Leave a Comment..."
                    placeholderTextColor="#999"
                    style={styles.commentTextInput}
                    value={commentText}
                    onChangeText={setCommentText}
                    editable={!isSubmitting}
                  />
                  <View style={styles.commentInputActions}>
                    <TouchableOpacity>
                      <Ionicons name="at" size={24} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Ionicons name="happy-outline" size={24} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSubmitComment}
                      disabled={!commentText.trim() || isSubmitting}
                      style={[
                        styles.sendButton,
                        (!commentText.trim() || isSubmitting) &&
                          styles.sendButtonDisabled,
                      ]}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Ionicons name="send" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <RoleNavigation role="user" />
      {showPayment && !closedByUser && <Payment onClose={closePayment} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
  },
  dimmedContent: {
    opacity: 0.2,
    pointerEvents: 'none',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF4B55',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  eventCard: {
    margin: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  dateChip: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  monthText: {
    color: 'white',
    fontSize: 12,
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  eventTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 12,
    fontFamily: 'Urbanist_600SemiBold',
  },
  buyButton: {
    backgroundColor: '#BA0507',
    marginHorizontal: 12,
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  infoCard: {
    margin: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Urbanist_600SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    color: '#E1E1E1',
    width: 80,
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
  },
  infoValue: {
    color: 'white',
    flex: 1,
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
  },
  detailsCard: {
    margin: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
    marginBottom: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tab: {
    paddingBottom: 8,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    color: '#E1E1E1',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Urbanist_600SemiBold',
  },
  description: {
    color: '#E1E1E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  highlightsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Urbanist_600SemiBold',
  },
  highlightsList: {
    marginLeft: 8,
  },
  highlightItem: {
    color: '#E1E1E1',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Urbanist_400Regular',
  },
  commentsSection: {
    paddingTop: 4,
  },
  commentsCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Urbanist_600SemiBold',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  commentAuthor: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 6,
    fontFamily: 'Urbanist_600SemiBold',
  },
  commentTime: {
    color: '#999',
    fontSize: 11,
    fontFamily: 'Urbanist_400Regular',
  },
  commentText: {
    color: '#E1E1E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
    fontFamily: 'Urbanist_400Regular',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#999',
    fontSize: 11,
    fontFamily: 'Urbanist_400Regular',
  },
  actionDot: {
    color: '#999',
    marginHorizontal: 4,
  },
  likeButton: {
    marginLeft: 8,
  },
  replyItem: {
    marginLeft: 40,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  commentTextInput: {
    flex: 1,
    color: 'white',
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
    height: 32,
  },
  commentInputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingBottom: 25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#E1E1E1',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Urbanist_400Regular',
  },
  activeNavText: {
    color: '#FF4B55',
  },
  sendButton: {
    backgroundColor: '#FF4B55',
    borderRadius: 20,
    padding: 8,
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#666',
  },
  activeActionText: {
    color: '#FF4B55',
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 40,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  replyInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  replyTextInput: {
    flex: 1,
    color: 'white',
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
    height: 32,
  },
  replyButton: {
    backgroundColor: '#FF4B55',
    borderRadius: 16,
    padding: 6,
    marginLeft: 8,
  },
  replyButtonDisabled: {
    backgroundColor: '#666',
  },
  errorText: {
    color: '#FF4B55',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
});
